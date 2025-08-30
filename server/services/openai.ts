import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV || "default_key" 
});

export interface GeneratedQuestion {
  questionText: string;
  questionType: "text" | "select" | "range" | "checkbox";
  options?: string[];
  step: number;
}

export async function generateFollowUpQuestions(
  productData: {
    name: string;
    category: string;
    audience?: string;
    description?: string;
    certifications?: Record<string, boolean>;
  },
  previousQuestions: string[] = [],
  currentStep: number = 1
): Promise<GeneratedQuestion[]> {
  try {
    const prompt = `
You are an expert in product transparency and consumer safety. Generate 3-5 intelligent follow-up questions for this product submission:

Product Information:
- Name: ${productData.name}
- Category: ${productData.category}
- Target Audience: ${productData.audience || 'General'}
- Description: ${productData.description || 'Not provided'}
- Certifications: ${JSON.stringify(productData.certifications || {})}

Previous Questions Asked: ${previousQuestions.join(', ') || 'None'}

Generate questions that:
1. Are specific to the product category and target audience
2. Focus on health, safety, and transparency concerns
3. Help consumers make informed decisions
4. Don't repeat previous questions
5. Are appropriate for step ${currentStep} of the assessment
6. Address regulatory compliance relevant to the product category
7. Explore supply chain transparency and ethical sourcing
8. Investigate manufacturing processes and quality control
9. Examine environmental impact and sustainability practices

For food products, focus on: ingredients, allergens, nutritional information, sourcing, processing methods
For cosmetics, focus on: ingredients safety, testing methods, packaging, shelf life, target skin types
For supplements, focus on: active ingredients, dosage, clinical studies, manufacturing standards, interactions
For household products, focus on: chemical composition, safety warnings, environmental impact, disposal
For textiles, focus on: material sourcing, manufacturing conditions, chemical treatments, durability

Question types:
- "text" for detailed explanations and open-ended responses
- "select" for categorical choices (provide 3-5 relevant options)
- "range" for percentage or numerical scales (0-100)
- "checkbox" for yes/no or multiple selection scenarios

Return JSON in this exact format:
{
  "questions": [
    {
      "questionText": "Question text here",
      "questionType": "text|select|range|checkbox",
      "options": ["option1", "option2"] or null,
      "step": ${currentStep}
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in product transparency and consumer safety. Generate intelligent, specific questions that help assess product transparency and safety. Focus on actionable insights that benefit consumers making ethical and health-conscious decisions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    console.error("Failed to generate AI questions:", error);
    throw new Error("Failed to generate follow-up questions: " + (error as Error).message);
  }
}

export async function generateTransparencyScore(
  productData: Record<string, any>,
  questionResponses: Record<string, any>
): Promise<{
  transparencyScore: number;
  healthScore: string;
  highlights: string[];
  analysis: string;
  recommendations: string[];
}> {
  try {
    const prompt = `
Analyze this product submission for transparency and health scoring:

Product Data: ${JSON.stringify(productData, null, 2)}
Question Responses: ${JSON.stringify(questionResponses, null, 2)}

Generate a comprehensive analysis with:

1. Transparency Score (0-100): Based on:
   - Completeness of information provided (40%)
   - Supply chain visibility (20%)
   - Manufacturing process disclosure (20%)
   - Certifications and compliance (20%)

2. Health Score (A+ to F): Based on:
   - Safety profile and risk assessment
   - Ingredient quality and sourcing
   - Regulatory compliance
   - Target audience appropriateness

3. Key Highlights: 3-6 specific positive transparency aspects that build consumer trust

4. Analysis: 2-3 sentence explanation of scoring rationale focusing on strengths and transparency efforts

5. Recommendations: 2-4 actionable suggestions for improving transparency or addressing any concerns

Scoring Guidelines:
- A+/A: Exceptional transparency, comprehensive disclosure, highest safety standards
- B+/B: Good transparency with minor gaps, solid safety profile
- C+/C: Adequate transparency, meets basic requirements, some improvement needed
- D/F: Significant transparency gaps, safety concerns, or insufficient information

Return JSON in this format:
{
  "transparencyScore": 85,
  "healthScore": "A",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "analysis": "Analysis text explaining the scores and transparency efforts",
  "recommendations": ["recommendation 1", "recommendation 2"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in product transparency assessment and health evaluation. Provide fair, accurate scoring based on the information provided. Focus on actionable insights that help both manufacturers and consumers make better decisions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      transparencyScore: Math.max(0, Math.min(100, result.transparencyScore || 0)),
      healthScore: result.healthScore || "C",
      highlights: result.highlights || [],
      analysis: result.analysis || "Analysis unavailable",
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("Failed to generate transparency score:", error);
    throw new Error("Failed to analyze product transparency: " + (error as Error).message);
  }
}
