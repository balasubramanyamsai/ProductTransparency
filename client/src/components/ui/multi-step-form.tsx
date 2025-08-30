import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ProgressIndicator from "./progress-indicator";
import type { Product, AiQuestion } from "@shared/schema";

const basicInfoSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  audience: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  certifications: z.object({
    organic: z.boolean().optional(),
    nonGmo: z.boolean().optional(),
    fairTrade: z.boolean().optional(),
  }).optional(),
});

interface MultiStepFormProps {
  productId?: string;
  onComplete?: (productId: string) => void;
}

export default function MultiStepForm({ productId, onComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [aiQuestions, setAiQuestions] = useState<AiQuestion[]>([]);
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const totalSteps = 4;
  const stepLabels = ["Basic Info", "Details", "AI Questions", "Review"];

  // Fetch existing product if editing
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      category: "",
      audience: "",
      description: "",
      location: "",
      certifications: {
        organic: false,
        nonGmo: false,
        fairTrade: false,
      },
    },
  });

  // Create/update product mutation
  const productMutation = useMutation({
    mutationFn: async (data: z.infer<typeof basicInfoSchema>) => {
      if (productId) {
        return apiRequest("PATCH", `/api/products/${productId}`, data);
      } else {
        return apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: async (response) => {
      const savedProduct = await response.json();
      
      if (!productId) {
        // New product created, navigate to it
        window.history.replaceState({}, "", `/submit/${savedProduct.id}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setCurrentStep(2);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save product information",
        variant: "destructive",
      });
    },
  });

  // Generate AI questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: async (currentProductId: string) => {
      return apiRequest("POST", `/api/products/${currentProductId}/generate-questions`, {
        currentStep: currentStep,
      });
    },
    onSuccess: async (response) => {
      const questions = await response.json();
      setAiQuestions(questions);
      setCurrentStep(3);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate AI questions",
        variant: "destructive",
      });
    },
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (currentProductId: string) => {
      return apiRequest("POST", `/api/products/${currentProductId}/generate-report`);
    },
    onSuccess: async (response) => {
      const report = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      if (onComplete) {
        onComplete(productId || "");
      }
      
      toast({
        title: "Success!",
        description: "Your transparency report has been generated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    },
  });

  const onSubmitBasicInfo = (data: z.infer<typeof basicInfoSchema>) => {
    productMutation.mutate(data);
  };

  const handleGenerateQuestions = () => {
    const currentProductId = productId || new URLSearchParams(window.location.search).get("id");
    if (currentProductId) {
      generateQuestionsMutation.mutate(currentProductId);
    }
  };

  const handleAiResponseChange = (questionId: string, response: string) => {
    setAiResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleCompleteAiQuestions = () => {
    // Save AI responses and move to review
    setCurrentStep(4);
  };

  const handleGenerateReport = () => {
    const currentProductId = productId || new URLSearchParams(window.location.search).get("id");
    if (currentProductId) {
      generateReportMutation.mutate(currentProductId);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4" data-testid="form-title">Submit Your Product</h2>
        <p className="text-xl text-muted-foreground" data-testid="form-subtitle">
          Our AI will guide you through a personalized transparency assessment
        </p>
      </div>

      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepLabels={stepLabels}
      />

      <Card className="shadow-lg border border-border">
        <CardContent className="p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="form-step" data-testid="step-basic-info">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Basic Information</h3>
                <p className="text-muted-foreground">
                  Let's start with the basics about your product.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitBasicInfo)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Healthy Kids Crackers"
                              {...field}
                              data-testid="input-product-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select category..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="food">Food & Beverages</SelectItem>
                              <SelectItem value="cosmetics">Cosmetics & Personal Care</SelectItem>
                              <SelectItem value="supplements">Supplements & Vitamins</SelectItem>
                              <SelectItem value="household">Household Products</SelectItem>
                              <SelectItem value="textiles">Textiles & Clothing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product's purpose, benefits, and key features..."
                            rows={4}
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={productMutation.isPending}
                      data-testid="button-continue-step-1"
                    >
                      {productMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 2: Detailed Information */}
          {currentStep === 2 && (
            <div className="form-step" data-testid="step-details">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Product Details</h3>
                <p className="text-muted-foreground">
                  Tell us more about your product's characteristics and intended use.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <Select
                      onValueChange={(value) => form.setValue("audience", value)}
                      defaultValue={form.getValues("audience")}
                    >
                      <SelectTrigger data-testid="select-audience">
                        <SelectValue placeholder="Select audience..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Public</SelectItem>
                        <SelectItem value="children">Children</SelectItem>
                        <SelectItem value="elderly">Elderly</SelectItem>
                        <SelectItem value="athletes">Athletes</SelectItem>
                        <SelectItem value="medical">Medical/Therapeutic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Manufacturing Location</label>
                    <Input
                      placeholder="e.g., Portland, Oregon, USA"
                      value={form.watch("location") || ""}
                      onChange={(e) => form.setValue("location", e.target.value)}
                      data-testid="input-location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Certifications</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="organic"
                        checked={form.watch("certifications.organic") || false}
                        onCheckedChange={(checked) => 
                          form.setValue("certifications.organic", checked as boolean)
                        }
                        data-testid="checkbox-organic"
                      />
                      <label htmlFor="organic" className="text-sm">USDA Organic</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nonGmo"
                        checked={form.watch("certifications.nonGmo") || false}
                        onCheckedChange={(checked) => 
                          form.setValue("certifications.nonGmo", checked as boolean)
                        }
                        data-testid="checkbox-non-gmo"
                      />
                      <label htmlFor="nonGmo" className="text-sm">Non-GMO Project Verified</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fairTrade"
                        checked={form.watch("certifications.fairTrade") || false}
                        onCheckedChange={(checked) => 
                          form.setValue("certifications.fairTrade", checked as boolean)
                        }
                        data-testid="checkbox-fair-trade"
                      />
                      <label htmlFor="fairTrade" className="text-sm">Fair Trade Certified</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  data-testid="button-previous-step-2"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={generateQuestionsMutation.isPending}
                  data-testid="button-generate-questions"
                >
                  {generateQuestionsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate AI Questions
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: AI Questions */}
          {currentStep === 3 && (
            <div className="form-step" data-testid="step-ai-questions">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">AI-Generated Deep Dive</h3>
                <p className="text-muted-foreground">
                  Our AI has generated specific questions based on your responses.
                </p>
              </div>

              {aiQuestions.length > 0 && (
                <div className="p-6 bg-accent/5 border border-accent/20 rounded-lg mb-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-accent mb-1">AI-Generated Questions</h4>
                      <p className="text-sm text-muted-foreground">
                        Please answer these personalized questions about your product:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {aiQuestions.map((question, index) => (
                      <div key={question.id} className="space-y-2">
                        <label className="block text-sm font-medium">
                          {index + 1}. {question.questionText}
                        </label>
                        
                        {question.questionType === "text" && (
                          <Textarea
                            placeholder="Enter your response..."
                            value={aiResponses[question.id] || ""}
                            onChange={(e) => handleAiResponseChange(question.id, e.target.value)}
                            rows={3}
                            data-testid={`textarea-ai-question-${index}`}
                          />
                        )}

                        {question.questionType === "select" && question.options && (
                          <Select
                            onValueChange={(value) => handleAiResponseChange(question.id, value)}
                            value={aiResponses[question.id] || ""}
                          >
                            <SelectTrigger data-testid={`select-ai-question-${index}`}>
                              <SelectValue placeholder="Select an option..." />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {question.questionType === "range" && (
                          <div className="space-y-2">
                            <Slider
                              value={[parseInt(aiResponses[question.id] || "50")]}
                              onValueChange={(value) => handleAiResponseChange(question.id, value[0].toString())}
                              max={100}
                              step={1}
                              data-testid={`slider-ai-question-${index}`}
                            />
                            <div className="text-right">
                              <Badge variant="secondary">
                                {aiResponses[question.id] || "50"}%
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  data-testid="button-previous-step-3"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleCompleteAiQuestions}
                  data-testid="button-continue-step-3"
                >
                  Continue to Review
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Generate Report */}
          {currentStep === 4 && (
            <div className="form-step" data-testid="step-review">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Review & Generate Report</h3>
                <p className="text-muted-foreground">
                  Review your responses and generate your transparency report.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Product Summary</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {form.getValues("name")}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {form.getValues("category")}
                    </div>
                    <div>
                      <span className="font-medium">Audience:</span> {form.getValues("audience") || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {form.getValues("location") || "Not specified"}
                    </div>
                  </div>
                </div>

                {aiQuestions.length > 0 && (
                  <div className="bg-muted p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">AI Question Responses</h4>
                    <div className="space-y-2 text-sm">
                      {aiQuestions.map((question, index) => (
                        <div key={question.id}>
                          <span className="font-medium">{index + 1}. {question.questionText}</span>
                          <div className="text-muted-foreground ml-4">
                            {aiResponses[question.id] || "No response"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  data-testid="button-previous-step-4"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  disabled={generateReportMutation.isPending}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-generate-report"
                >
                  {generateReportMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    "Generate Transparency Report"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
