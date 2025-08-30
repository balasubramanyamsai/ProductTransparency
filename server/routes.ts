import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertAiQuestionSchema } from "@shared/schema";
import { generateFollowUpQuestions, generateTransparencyScore } from "./services/openai";
import { generatePDFReport, generateSampleReport } from "./services/pdf-generator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      // For now, get all products (in real app, filter by user)
      const products = await storage.getProductsByUser("demo-user");
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse({
        ...req.body,
        userId: "demo-user", // In real app, get from auth
        status: "draft"
      });
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data", error: (error as Error).message });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // AI Questions routes
  app.post("/api/products/:id/generate-questions", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const existingQuestions = await storage.getQuestionsByProduct(req.params.id);
      const previousQuestionTexts = existingQuestions.map(q => q.questionText);
      
      const { currentStep = 1 } = req.body;

      const generatedQuestions = await generateFollowUpQuestions(
        {
          name: product.name,
          category: product.category,
          audience: product.audience || undefined,
          description: product.description || undefined,
          certifications: product.certifications as Record<string, boolean> | undefined
        },
        previousQuestionTexts,
        currentStep
      );

      // Save generated questions to database
      const savedQuestions = [];
      for (const q of generatedQuestions) {
        const savedQuestion = await storage.createQuestion({
          productId: req.params.id,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options || null,
          response: null,
          step: q.step,
          generatedBy: "ai"
        });
        savedQuestions.push(savedQuestion);
      }

      res.json(savedQuestions);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to generate questions", 
        error: (error as Error).message 
      });
    }
  });

  app.get("/api/products/:id/questions", async (req, res) => {
    try {
      const questions = await storage.getQuestionsByProduct(req.params.id);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.patch("/api/questions/:id/response", async (req, res) => {
    try {
      const { response } = req.body;
      if (!response) {
        return res.status(400).json({ message: "Response is required" });
      }

      const question = await storage.updateQuestionResponse(req.params.id, response);
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to update question response" });
    }
  });

  // Reports routes
  app.post("/api/products/:id/generate-report", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const questions = await storage.getQuestionsByProduct(req.params.id);
      const questionResponses = questions.reduce((acc, q) => {
        if (q.response) {
          acc[q.questionText] = q.response;
        }
        return acc;
      }, {} as Record<string, any>);

      // Generate transparency score using AI
      const analysis = await generateTransparencyScore(
        {
          name: product.name,
          category: product.category,
          description: product.description,
          certifications: product.certifications,
          ...product.basicInfo
        },
        questionResponses
      );

      // Create report
      const report = await storage.createReport({
        productId: req.params.id,
        transparencyScore: analysis.transparencyScore,
        healthScore: analysis.healthScore,
        highlights: analysis.highlights,
        reportData: {
          analysis: analysis.analysis,
          questionResponses,
          recommendations: analysis.recommendations
        } as Record<string, any>,
        pdfUrl: null
      });

      // Generate PDF
      const pdfBuffer = await generatePDFReport({
        product,
        report,
        questions: questions.map(q => ({
          questionText: q.questionText,
          response: q.response || ""
        }))
      });

      // In a real app, you would save the PDF to cloud storage and update the report with the URL
      // For now, we'll just return the report
      res.json(report);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to generate report", 
        error: (error as Error).message 
      });
    }
  });

  app.get("/api/products/:id/reports", async (req, res) => {
    try {
      const reports = await storage.getReportsByProduct(req.params.id);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id/download", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      const product = await storage.getProduct(report.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const questions = await storage.getQuestionsByProduct(report.productId);
      
      const pdfBuffer = await generatePDFReport({
        product,
        report,
        questions: questions.map(q => ({
          questionText: q.questionText,
          response: q.response || ""
        }))
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${product.name}-transparency-report.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to download report" });
    }
  });

  // Sample report download
  app.get("/api/sample-report", async (req, res) => {
    try {
      const pdfBuffer = await generateSampleReport();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="sample-transparency-report.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate sample report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
