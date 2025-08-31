import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to configure it?");
}

import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger (use morgan instead if you like)
app.use((req, _res, next) => {
  log(`${req.method} ${req.path}`);
  next();
});

(async () => {
  await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    log(`❌ Error: ${message}`);
    res.status(status).json({ message });
  });

  // Frontend: vite in dev, static in prod
if (app.get("env") === "development") {
  await setupVite(app);
} else {
  serveStatic(app);
}


  const port = parseInt(process.env.PORT || "5000", 10);
  app.listen(port, () => {
    log(`🚀 Server running at http://localhost:${port}`);
  });
})();
