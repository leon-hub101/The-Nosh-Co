import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupSecurityMiddleware } from "./middleware/security";
import { logger } from "./utils/logger";
import { db } from "./db";

const app = express();
const isDevelopment = process.env.NODE_ENV !== "production";

declare module 'http' {
  interface IncomingMessage {
    rawBody: Buffer | string
  }
}

// Security middleware (helmet, CORS, rate limiting)
setupSecurityMiddleware(app);

// Session configuration with PostgreSQL store
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      conObject: {
        connectionString: process.env.DATABASE_URL,
        ssl: isDevelopment ? false : { rejectUnauthorized: false },
      },
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "nosh-co-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    name: "nosh.sid", // Custom session cookie name
    cookie: {
      secure: !isDevelopment, // HTTPS only in production
      httpOnly: true, // Prevent client-side JavaScript access
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Capture raw body for PayFast ITN verification
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: false,
  verify: (req, _res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Request logging middleware (structured logging with Winston)
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    };

    if (res.statusCode >= 500) {
      logger.error("Request error", logData);
    } else if (res.statusCode >= 400) {
      logger.warn("Request warning", logData);
    } else if (req.path.startsWith("/api")) {
      logger.info("API request", logData);
    }
  });

  next();
});

// Serve stock images as static assets with security options
const stockImagesPath = path.resolve(process.cwd(), 'attached_assets', 'stock_images');
app.use('/stock_images', express.static(stockImagesPath, {
  fallthrough: false,  // Return 404 instead of passing to next handler
  index: false,        // Disable directory listing
  extensions: false,   // Disable extension searching
}));

(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Log error details
    logger.error("Request error", {
      errorId,
      status,
      message: err.message,
      stack: err.stack,
      method: req.method,
      path: req.path,
      ip: req.ip,
    });

    // Hide stack traces in production
    if (isDevelopment) {
      res.status(status).json({
        error: err.message || "Internal Server Error",
        errorId,
        stack: err.stack,
      });
    } else {
      res.status(status).json({
        error: status >= 500 ? "Internal Server Error" : err.message,
        errorId, // Send error ID for support reference
      });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    logger.info(`🚀 The Nosh Co. server started`, {
      port,
      environment: isDevelopment ? "development" : "production",
      nodeVersion: process.version,
    });
    log(`serving on port ${port}`);
  });
})();
