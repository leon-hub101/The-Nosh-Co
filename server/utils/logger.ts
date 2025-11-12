import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const isDevelopment = process.env.NODE_ENV !== "production";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}] ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// File rotation transport for all logs
const allLogsTransport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  format: logFormat,
});

// File rotation transport for errors only
const errorLogsTransport = new DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxSize: "20m",
  maxFiles: "30d",
  format: logFormat,
});

// File rotation transport for auth events
const authLogsTransport = new DailyRotateFile({
  filename: "logs/auth-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m",
  maxFiles: "30d",
  format: logFormat,
});

// File rotation transport for payment events
const paymentLogsTransport = new DailyRotateFile({
  filename: "logs/payment-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m",
  maxFiles: "90d", // Keep payment logs for 90 days
  format: logFormat,
});

// Create the logger
export const logger = winston.createLogger({
  level: isDevelopment ? "debug" : "info",
  format: logFormat,
  transports: [
    allLogsTransport,
    errorLogsTransport,
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: "logs/exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: "logs/rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});

// Add console transport in development
if (isDevelopment) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Specialized loggers for different event types
export const authLogger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [authLogsTransport],
});

export const paymentLogger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [paymentLogsTransport],
});

// Helper functions for common log patterns
export const logAuth = {
  login: (email: string, success: boolean, ip?: string) => {
    authLogger.info("Login attempt", { email, success, ip, event: "login" });
  },
  logout: (email: string, ip?: string) => {
    authLogger.info("Logout", { email, ip, event: "logout" });
  },
  register: (email: string, ip?: string) => {
    authLogger.info("User registered", { email, ip, event: "register" });
  },
  passwordChange: (email: string, ip?: string) => {
    authLogger.info("Password changed", { email, ip, event: "password_change" });
  },
};

export const logPayment = {
  created: (orderId: string, amount: string, method: string) => {
    paymentLogger.info("Payment created", { orderId, amount, method, event: "payment_created" });
  },
  verified: (orderId: string, transactionId: string, amount: string) => {
    paymentLogger.info("Payment verified", { orderId, transactionId, amount, event: "payment_verified" });
  },
  failed: (orderId: string, reason: string) => {
    paymentLogger.error("Payment failed", { orderId, reason, event: "payment_failed" });
  },
  itn: (payload: any) => {
    paymentLogger.info("PayFast ITN received", { payload, event: "payfast_itn" });
  },
};

export const logOrder = {
  created: (orderId: string, total: string, itemCount: number) => {
    logger.info("Order created", { orderId, total, itemCount, event: "order_created" });
  },
  updated: (orderId: string, status: string) => {
    logger.info("Order status updated", { orderId, status, event: "order_updated" });
  },
};

export default logger;
