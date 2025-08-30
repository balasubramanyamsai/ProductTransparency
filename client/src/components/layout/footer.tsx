import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-xl">Altibbe</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Building trust through product transparency and ethical systems.
            </p>
            <div className="text-xs text-muted-foreground">
              <div>Health • Wisdom • Virtue</div>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Platform</h5>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="/submit">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-submit-product">
                  Submit Product
                </span>
              </Link>
              <Link href="/reports">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-view-reports">
                  View Reports
                </span>
              </Link>
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-analytics">
                Analytics
              </a>
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-api-docs">
                API Documentation
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-help-center">
                Help Center
              </a>
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-blog">
                Blog
              </a>
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-case-studies">
                Case Studies
              </a>
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-contact">
                Contact
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-privacy-policy">
                Privacy Policy
              </a>
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-terms-of-service">
                Terms of Service
              </a>
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-data-security">
                Data Security
              </a>
              <a href="#" className="block hover:text-foreground transition-colors" data-testid="footer-compliance">
                Compliance
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p data-testid="footer-copyright">
            &copy; 2024 Altibbe. All rights reserved. Building ethical systems for a transparent world.
          </p>
        </div>
      </div>
    </footer>
  );
}
