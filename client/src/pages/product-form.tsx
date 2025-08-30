import { useParams } from "wouter";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MultiStepForm from "@/components/ui/multi-step-form";

export default function ProductForm() {
  const params = useParams();
  const [, navigate] = useLocation();
  
  const productId = params.id;

  const handleFormComplete = (completedProductId: string) => {
    navigate(`/reports/${completedProductId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 px-4">
        <MultiStepForm 
          productId={productId}
          onComplete={handleFormComplete}
        />
      </main>
      
      <Footer />
    </div>
  );
}
