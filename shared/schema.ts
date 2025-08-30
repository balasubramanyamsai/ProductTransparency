import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  audience: text("audience"),
  description: text("description"),
  location: text("location"),
  certifications: jsonb("certifications").$type<{
    organic?: boolean;
    nonGmo?: boolean;
    fairTrade?: boolean;
    [key: string]: boolean | undefined;
  }>(),
  basicInfo: jsonb("basic_info").$type<Record<string, any>>(),
  aiResponses: jsonb("ai_responses").$type<Record<string, any>>(),
  status: text("status").notNull().default("draft"), // draft, submitted, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiQuestions = pgTable("ai_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // text, select, range, checkbox
  options: jsonb("options").$type<string[]>(),
  response: text("response"),
  step: integer("step").notNull(),
  generatedBy: text("generated_by").notNull().default("ai"), // ai, system
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  transparencyScore: integer("transparency_score"),
  healthScore: text("health_score"),
  highlights: jsonb("highlights").$type<string[]>(),
  pdfUrl: text("pdf_url"),
  reportData: jsonb("report_data").$type<Record<string, any>>(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  questions: many(aiQuestions),
  reports: many(reports),
}));

export const aiQuestionsRelations = relations(aiQuestions, ({ one }) => ({
  product: one(products, {
    fields: [aiQuestions.productId],
    references: [products.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  product: one(products, {
    fields: [reports.productId],
    references: [products.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiQuestionSchema = createInsertSchema(aiQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  generatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertAiQuestion = z.infer<typeof insertAiQuestionSchema>;
export type AiQuestion = typeof aiQuestions.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
