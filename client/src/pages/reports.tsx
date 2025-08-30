import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, 
  FileText, 
  Calendar, 
  BarChart3, 
  Award,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { downloadReport } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Product, Report } from "@shared/schema";

export default function Reports() {
  const params = useParams();
  const { toast } = useToast();
  
  const productId = params.id;

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    enabled: !productId,
  });

  // Fetch specific product and its reports if productId is provided
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/products", productId, "reports"],
    enabled: !!productId,
  });

  const handleDownloadReport = async (reportId: string, productName: string) => {
    try {
      await downloadReport(reportId, productName);
      toast({
        title: "Download Started",
        description: "Your transparency report is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getHealthScoreColor = (score: string) => {
    if (score?.includes('A')) return 'text-accent';
    if (score?.includes('B')) return 'text-primary';
    if (score?.includes('C')) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  if (productId) {
    // Individual product reports view
    if (productLoading || reportsLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <Skeleton className="h-8 w-48 mb-8" />
              <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    if (!product) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="py-16 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <h1 className="text-2xl font-bold mb-4" data-testid="product-not-found-title">
                Product Not Found
              </h1>
              <p className="text-muted-foreground mb-8" data-testid="product-not-found-description">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/reports">
                <Button data-testid="button-back-to-reports">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Reports
                </Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <Link href="/reports">
                <Button variant="ghost" className="mb-4" data-testid="button-back-to-all-reports">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  All Reports
                </Button>
              </Link>
              
              <h1 className="text-3xl font-bold mb-2" data-testid="product-reports-title">
                {(product as Product).name}
              </h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <Badge variant="secondary" data-testid="product-category-badge">
                  {(product as Product).category}
                </Badge>
                <span data-testid="product-created-date">
                  Created {formatDate((product as Product).createdAt)}
                </span>
              </div>
            </div>

            {reports && (reports as Report[]).length > 0 ? (
              <div className="space-y-6">
                {(reports as Report[]).map((report: Report) => (
                  <Card key={report.id} className="shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <span data-testid={`report-title-${report.id}`}>
                            Transparency Report
                          </span>
                        </CardTitle>
                        <Button
                          onClick={() => handleDownloadReport(report.id, (product as Product).name)}
                          size="sm"
                          data-testid={`button-download-report-${report.id}`}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-accent/10 rounded-lg">
                          <div className="text-3xl font-bold text-accent mb-1" data-testid={`transparency-score-${report.id}`}>
                            {report.transparencyScore || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Transparency Score</div>
                        </div>
                        
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <div className={`text-3xl font-bold mb-1 ${getHealthScoreColor(report.healthScore || '')}`} data-testid={`health-score-${report.id}`}>
                            {report.healthScore || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">Health Rating</div>
                        </div>
                        
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-center text-muted-foreground mb-1">
                            <Calendar className="h-5 w-5 mr-1" />
                            <span className="text-sm" data-testid={`report-generated-date-${report.id}`}>
                              {formatDate(report.generatedAt)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">Generated</div>
                        </div>
                      </div>

                      {report.highlights && report.highlights.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Award className="h-4 w-4 mr-2 text-accent" />
                            Key Highlights
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {report.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                                <span className="text-sm" data-testid={`highlight-${report.id}-${index}`}>
                                  {highlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span data-testid={`report-id-${report.id}`}>
                            Report ID: <span className="font-mono">{report.id}</span>
                          </span>
                          <Badge variant="outline" data-testid={`report-status-${report.id}`}>
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-12">
                <CardContent>
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2" data-testid="no-reports-title">
                    No Reports Generated Yet
                  </h3>
                  <p className="text-muted-foreground mb-6" data-testid="no-reports-description">
                    Complete the product submission process to generate your first transparency report.
                  </p>
                  <Link href={`/submit/${(product as Product).id}`}>
                    <Button data-testid="button-complete-submission">
                      Complete Submission
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // All products/reports overview
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4" data-testid="reports-overview-title">
              Product Reports
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="reports-overview-description">
              View and manage all your product transparency reports
            </p>
          </div>

          {products && (products as Product[]).length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(products as Product[]).map((product: Product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate" data-testid={`product-card-name-${product.id}`}>
                        {product.name}
                      </span>
                      <Badge 
                        variant={product.status === 'completed' ? 'default' : 'secondary'}
                        data-testid={`product-status-${product.id}`}
                      >
                        {product.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline" data-testid={`product-category-${product.id}`}>
                          {product.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span data-testid={`product-created-${product.id}`}>
                          {formatDate(product.createdAt)}
                        </span>
                      </div>

                      {product.audience && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Audience:</span>
                          <span data-testid={`product-audience-${product.id}`}>
                            {product.audience}
                          </span>
                        </div>
                      )}

                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`product-description-${product.id}`}>
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-6">
                      <Link href={`/reports/${product.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          data-testid={`button-view-reports-${product.id}`}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Reports
                        </Button>
                      </Link>
                      
                      {product.status !== 'completed' && (
                        <Link href={`/submit/${product.id}`}>
                          <Button 
                            size="sm" 
                            className="w-full"
                            data-testid={`button-continue-submission-${product.id}`}
                          >
                            Continue Submission
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center p-12">
              <CardContent>
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2" data-testid="no-products-title">
                  No Products Submitted Yet
                </h3>
                <p className="text-muted-foreground mb-6" data-testid="no-products-description">
                  Start by submitting your first product to generate transparency reports.
                </p>
                <Link href="/submit">
                  <Button data-testid="button-submit-first-product">
                    Submit Your First Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 p-6 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">
                Need help getting started?
              </div>
              <Link href="/submit">
                <Button size="sm" data-testid="button-start-new-submission">
                  Start New Submission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
