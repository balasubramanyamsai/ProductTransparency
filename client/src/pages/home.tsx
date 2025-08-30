import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Shield,
  FileText,
  Brain,
  BarChart3,
  Heart,
  Users,
  Award,
  Download,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { downloadSampleReport } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  const handleDownloadSample = async () => {
    try {
      await downloadSampleReport();
      toast({
        title: "Download Started",
        description: "Your sample report is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download sample report",
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient py-24 px-4 text-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1
                className="text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight"
                data-testid="hero-title"
              >
                Build Trust Through
                <span className="text-accent"> Product Transparency</span>
              </h1>
              <p
                className="text-xl text-black/90 mb-8 leading-relaxed"
                data-testid="hero-description"
              >
                Our AI-powered platform generates comprehensive transparency
                reports through intelligent questioning, helping consumers make
                informed, ethical, and health-conscious decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/submit">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg text-lg px-8 py-4"
                    data-testid="button-submit-product"
                  >
                    Submit Your Product
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleDownloadSample}
                  className="border-2 border-white text-black hover:bg-white hover:text-primary text-lg px-8 py-4"
                  data-testid="button-sample-report"
                >
                  View Sample Report
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="transform rotate-3 hover:rotate-0 transition-transform duration-300 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-accent rounded"></div>
                      <div className="h-8 bg-gray-100 rounded flex-1"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="trust-badge text-center border">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3
                  className="font-semibold text-lg mb-2"
                  data-testid="trust-badge-ai-title"
                >
                  AI-Powered Intelligence
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="trust-badge-ai-description"
                >
                  Smart follow-up questions adapt to your product type
                </p>
              </CardContent>
            </Card>

            <Card className="trust-badge text-center border">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3
                  className="font-semibold text-lg mb-2"
                  data-testid="trust-badge-security-title"
                >
                  Secure & Private
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="trust-badge-security-description"
                >
                  Enterprise-grade security for your product data
                </p>
              </CardContent>
            </Card>

            <Card className="trust-badge text-center border">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3
                  className="font-semibold text-lg mb-2"
                  data-testid="trust-badge-reports-title"
                >
                  Professional Reports
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="trust-badge-reports-description"
                >
                  PDF transparency reports ready for distribution
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              data-testid="features-title"
            >
              Platform Features
            </h2>
            <p
              className="text-xl text-muted-foreground"
              data-testid="features-subtitle"
            >
              Everything you need for comprehensive product transparency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  data-testid="feature-smart-questioning-title"
                >
                  Smart Questioning
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="feature-smart-questioning-description"
                >
                  AI adapts questions based on product type, regulations, and
                  previous answers for comprehensive data collection.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  data-testid="feature-analytics-title"
                >
                  Data Analytics
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="feature-analytics-description"
                >
                  Track submission trends, identify gaps in transparency, and
                  benchmark against industry standards.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-accent" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  data-testid="feature-pdf-reports-title"
                >
                  PDF Reports
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="feature-pdf-reports-description"
                >
                  Professional transparency reports formatted for consumers,
                  retailers, and regulatory compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  data-testid="feature-health-first-title"
                >
                  Health-First Focus
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="feature-health-first-description"
                >
                  Prioritize health and safety information that matters most to
                  conscious consumers.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  data-testid="feature-collaboration-title"
                >
                  Team Collaboration
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="feature-collaboration-description"
                >
                  Share reports with team members, track changes, and maintain
                  version history.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  data-testid="feature-compliance-title"
                >
                  Compliance Ready
                </h3>
                <p
                  className="text-muted-foreground"
                  data-testid="feature-compliance-description"
                >
                  Reports formatted to meet regulatory requirements and industry
                  transparency standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Report Preview */}
      <section id="reports" className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              data-testid="report-preview-title"
            >
              Sample Transparency Report
            </h2>
            <p
              className="text-xl text-muted-foreground"
              data-testid="report-preview-subtitle"
            >
              See how your product information becomes a comprehensive
              transparency report
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3
                className="text-2xl font-semibold mb-6"
                data-testid="report-whats-included-title"
              >
                What's Included
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4
                      className="font-semibold"
                      data-testid="report-feature-ingredients-title"
                    >
                      Complete Ingredient Analysis
                    </h4>
                    <p
                      className="text-muted-foreground text-sm"
                      data-testid="report-feature-ingredients-description"
                    >
                      Detailed breakdown of all components, sourcing, and
                      processing methods
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4
                      className="font-semibold"
                      data-testid="report-feature-supply-chain-title"
                    >
                      Supply Chain Transparency
                    </h4>
                    <p
                      className="text-muted-foreground text-sm"
                      data-testid="report-feature-supply-chain-description"
                    >
                      Origins, transportation, and sustainability practices
                      throughout the chain
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4
                      className="font-semibold"
                      data-testid="report-feature-health-title"
                    >
                      Health & Safety Profile
                    </h4>
                    <p
                      className="text-muted-foreground text-sm"
                      data-testid="report-feature-health-description"
                    >
                      Allergen information, nutritional data, and safety
                      certifications
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4
                      className="font-semibold"
                      data-testid="report-feature-environmental-title"
                    >
                      Environmental Impact
                    </h4>
                    <p
                      className="text-muted-foreground text-sm"
                      data-testid="report-feature-environmental-description"
                    >
                      Carbon footprint, packaging sustainability, and
                      environmental certifications
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownloadSample}
                className="mt-8 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                data-testid="button-download-sample-report"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Sample Report (PDF)
              </Button>
            </div>

            {/* Report Preview Card */}
            <Card className="shadow-lg">
              <div className="bg-primary text-primary-foreground p-4">
                <div className="flex items-center justify-between">
                  <h4
                    className="font-semibold"
                    data-testid="report-preview-header-title"
                  >
                    Product Transparency Report
                  </h4>
                  <span
                    className="text-sm opacity-90"
                    data-testid="report-preview-header-generated"
                  >
                    Generated by Altibbe AI
                  </span>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                <div>
                  <h5
                    className="font-semibold text-lg mb-2"
                    data-testid="report-preview-product-name"
                  >
                    Healthy Kids Crackers
                  </h5>
                  <p
                    className="text-muted-foreground text-sm"
                    data-testid="report-preview-generated-date"
                  >
                    Report generated on March 15, 2024
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="text-center p-4 bg-accent/10">
                    <div
                      className="text-2xl font-bold text-accent"
                      data-testid="report-preview-transparency-score"
                    >
                      92
                    </div>
                    <div
                      className="text-sm text-muted-foreground"
                      data-testid="report-preview-transparency-label"
                    >
                      Transparency Score
                    </div>
                  </Card>
                  <Card className="text-center p-4 bg-primary/10">
                    <div
                      className="text-2xl font-bold text-primary"
                      data-testid="report-preview-health-score"
                    >
                      A+
                    </div>
                    <div
                      className="text-sm text-muted-foreground"
                      data-testid="report-preview-health-label"
                    >
                      Health Rating
                    </div>
                  </Card>
                </div>

                <div>
                  <h6
                    className="font-semibold mb-3"
                    data-testid="report-preview-highlights-title"
                  >
                    Key Highlights
                  </h6>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span
                        className="text-sm"
                        data-testid="report-preview-highlight-1"
                      >
                        100% Organic Certified Ingredients
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span
                        className="text-sm"
                        data-testid="report-preview-highlight-2"
                      >
                        75% Locally Sourced Materials
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span
                        className="text-sm"
                        data-testid="report-preview-highlight-3"
                      >
                        Zero Artificial Preservatives
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span data-testid="report-preview-report-id">
                      Report ID: <span className="font-mono">TPR-2024-001</span>
                    </span>
                    <span data-testid="report-preview-page-count">
                      12 pages
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              data-testid="how-it-works-title"
            >
              How It Works
            </h2>
            <p
              className="text-xl text-muted-foreground"
              data-testid="how-it-works-subtitle"
            >
              Simple steps to comprehensive transparency
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span
                  className="text-2xl font-bold text-primary-foreground"
                  data-testid="step-1-number"
                >
                  1
                </span>
              </div>
              <h4
                className="font-semibold text-lg mb-2"
                data-testid="step-1-title"
              >
                Submit Basic Info
              </h4>
              <p
                className="text-muted-foreground text-sm"
                data-testid="step-1-description"
              >
                Start with product name, category, and basic description
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span
                  className="text-2xl font-bold text-secondary-foreground"
                  data-testid="step-2-number"
                >
                  2
                </span>
              </div>
              <h4
                className="font-semibold text-lg mb-2"
                data-testid="step-2-title"
              >
                AI Generates Questions
              </h4>
              <p
                className="text-muted-foreground text-sm"
                data-testid="step-2-description"
              >
                Our AI creates personalized follow-up questions based on your
                product
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span
                  className="text-2xl font-bold text-accent-foreground"
                  data-testid="step-3-number"
                >
                  3
                </span>
              </div>
              <h4
                className="font-semibold text-lg mb-2"
                data-testid="step-3-title"
              >
                Complete Assessment
              </h4>
              <p
                className="text-muted-foreground text-sm"
                data-testid="step-3-description"
              >
                Answer intelligent questions about ingredients, sourcing, and
                manufacturing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span
                  className="text-2xl font-bold text-primary-foreground"
                  data-testid="step-4-number"
                >
                  4
                </span>
              </div>
              <h4
                className="font-semibold text-lg mb-2"
                data-testid="step-4-title"
              >
                Get Your Report
              </h4>
              <p
                className="text-muted-foreground text-sm"
                data-testid="step-4-description"
              >
                Download professional PDF transparency report ready for
                distribution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4" data-testid="cta-title">
            Ready to Build Consumer Trust?
          </h2>
          <p className="text-xl mb-8 opacity-90" data-testid="cta-description">
            Join forward-thinking companies using transparency as a competitive
            advantage
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/submit">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg text-lg px-8 py-4"
                data-testid="cta-button-start-report"
              >
                Start Your First Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-4"
              data-testid="cta-button-schedule-demo"
            >
              Schedule Demo
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div
                className="text-3xl font-bold mb-1"
                data-testid="stat-products-analyzed"
              >
                500+
              </div>
              <div
                className="text-sm opacity-80"
                data-testid="stat-products-analyzed-label"
              >
                Products Analyzed
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-bold mb-1"
                data-testid="stat-accuracy-rate"
              >
                95%
              </div>
              <div
                className="text-sm opacity-80"
                data-testid="stat-accuracy-rate-label"
              >
                Accuracy Rate
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-bold mb-1"
                data-testid="stat-turnaround-time"
              >
                24hr
              </div>
              <div
                className="text-sm opacity-80"
                data-testid="stat-turnaround-time-label"
              >
                Report Turnaround
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
