import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer" data-testid="logo-link">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-xl text-foreground">Altibbe</span>
          </div>
        </Link>
        
        <nav className="ml-auto flex items-center space-x-6">
          <a 
            href="#features" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-features"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-how-it-works"
          >
            How It Works
          </a>
          <a 
            href="#reports" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-reports"
          >
            Reports
          </a>
          <Link href="/submit">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
