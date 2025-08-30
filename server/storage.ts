import { 
  users, 
  products, 
  aiQuestions, 
  reports,
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type AiQuestion,
  type InsertAiQuestion,
  type Report,
  type InsertReport
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByUser(userId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // AI Question operations
  getQuestionsByProduct(productId: string): Promise<AiQuestion[]>;
  createQuestion(question: InsertAiQuestion): Promise<AiQuestion>;
  updateQuestionResponse(id: string, response: string): Promise<AiQuestion>;
  
  // Report operations
  getReportsByProduct(productId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: string): Promise<Report | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Product operations
  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.userId, userId))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const productData = {
      ...product,
      certifications: product.certifications as any,
      basicInfo: product.basicInfo as any,
      aiResponses: product.aiResponses as any
    };
    const [newProduct] = await db
      .insert(products)
      .values([productData])
      .returning();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product> {
    const updateData: any = { ...updates, updatedAt: new Date() };
    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // AI Question operations
  async getQuestionsByProduct(productId: string): Promise<AiQuestion[]> {
    return await db
      .select()
      .from(aiQuestions)
      .where(eq(aiQuestions.productId, productId))
      .orderBy(aiQuestions.step);
  }

  async createQuestion(question: InsertAiQuestion): Promise<AiQuestion> {
    const questionData = {
      ...question,
      options: question.options as any
    };
    const [newQuestion] = await db
      .insert(aiQuestions)
      .values([questionData])
      .returning();
    return newQuestion;
  }

  async updateQuestionResponse(id: string, response: string): Promise<AiQuestion> {
    const [question] = await db
      .update(aiQuestions)
      .set({ response })
      .where(eq(aiQuestions.id, id))
      .returning();
    return question;
  }

  // Report operations
  async getReportsByProduct(productId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.productId, productId))
      .orderBy(desc(reports.generatedAt));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const reportData = {
      ...report,
      highlights: report.highlights as any,
      reportData: report.reportData as any
    };
    const [newReport] = await db
      .insert(reports)
      .values([reportData])
      .returning();
    return newReport;
  }

  async getReport(id: string): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report || undefined;
  }
}

export const storage = new DatabaseStorage();
