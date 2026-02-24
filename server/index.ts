import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

function serveStatic(app: express.Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

const app = express();

// Track if routes have been registered (for serverless)
let routesRegistered = false;

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: process.env.NODE_ENV === 'development'
        ? ["'self'", "'unsafe-inline'"]
        : ["'self'"], // unsafe-inline only for Vite HMR in dev
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:", "wss:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for some embeds
}));

// Global rate limiter - 500 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints - 5 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many authentication attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Apply global rate limiter to all API routes
app.use("/api", globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize routes (called once, handles both serverless and standalone)
async function initializeRoutes() {
  if (routesRegistered) return;
  routesRegistered = true;

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error("Unhandled error:", err);
  });

  // On Vercel, static files are served by CDN — skip Vite and Express static serving.
  // For standalone: use Vite dev server in development, Express static in production.
  if (!isVercel) {
    if (app.get("env") === "development") {
      // Dynamic import avoids bundling Vite + Rollup into the production build
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
  }

  return server;
}

// For Vercel serverless: export the app after routes are registered
const isVercel = process.env.VERCEL === '1';

// Promise that resolves when routes are ready
let routesReady: Promise<void> | null = null;

if (isVercel) {
  // Vercel serverless - register routes and wait for them
  routesReady = initializeRoutes().then(() => {});
} else {
  // Standalone server - start listening
  (async () => {
    const server = await initializeRoutes();

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    server!.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  })();
}

// Export a handler that waits for routes to be ready (for Vercel)
const handler = async (req: Request, res: Response) => {
  if (routesReady) {
    await routesReady;
  }
  return app(req, res);
};

// Export app for Vercel serverless function
export default isVercel ? handler : app;
