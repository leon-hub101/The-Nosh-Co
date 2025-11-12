import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import type { Express } from "express";
import { logger } from "../utils/logger";

const isDevelopment = process.env.NODE_ENV !== "production";

export function setupSecurityMiddleware(app: Express) {
  // Helmet - Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'", // Required for Vite in development
            "https://www.gstatic.com", // Firebase
            "https://www.googletagmanager.com", // GA4
          ],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: [
            "'self'",
            "https://firebaseinstallations.googleapis.com",
            "https://fcmregistrations.googleapis.com",
            "https://fcm.googleapis.com",
            isDevelopment ? "ws://localhost:5000" : "",
            isDevelopment ? "http://localhost:5000" : "",
          ].filter(Boolean),
          frameSrc: ["'self'", "https://www.payfast.co.za", "https://sandbox.payfast.co.za"],
          workerSrc: ["'self'", "blob:"],
        },
      },
      crossOriginEmbedderPolicy: false, // Required for some third-party services
    })
  );

  // CORS - Cross-Origin Resource Sharing
  const allowedOrigins = [
    "https://thenosh.co",
    "https://www.thenosh.co",
    ...(isDevelopment ? ["http://localhost:5000", "http://localhost:3000"] : []),
  ];

  // Allow Replit domains in development
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow *.repl.co and *.replit.dev domains
      if (origin.endsWith(".repl.co") || origin.endsWith(".replit.dev")) {
        return callback(null, true);
      }

      // Reject other origins
      logger.warn("CORS blocked origin", { origin });
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  };

  app.use(cors(corsOptions));

  // Rate limiting for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: "Too many authentication attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        path: req.path,
        event: "rate_limit_auth",
      });
      res.status(429).json({
        error: "Too many requests, please try again later",
      });
    },
  });

  app.use("/api/auth", authLimiter);

  // Strict rate limiting for PayFast ITN endpoint
  const payfastLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: "Too many PayFast notifications",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
      logger.error("PayFast rate limit exceeded", {
        ip: req.ip,
        event: "rate_limit_payfast",
      });
      res.status(429).send("Too many requests");
    },
  });

  app.use("/api/payfast/notify", payfastLimiter);

  // General API rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per window
    message: "Too many requests, please slow down",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn("API rate limit exceeded", {
        ip: req.ip,
        path: req.path,
        event: "rate_limit_api",
      });
      res.status(429).json({
        error: "Too many requests, please try again later",
      });
    },
  });

  app.use("/api", apiLimiter);

  logger.info("Security middleware configured", {
    helmet: true,
    cors: true,
    rateLimit: true,
    environment: isDevelopment ? "development" : "production",
  });
}
