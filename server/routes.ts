import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DbStorage } from "./db-storage";
import bcrypt from "bcrypt";
import { generatePayFastSignature, verifyPayFastSignature, getPayFastConfig, validatePayFastPayment } from "./payfast";
import { requireAuth, requireAdmin } from "./middleware";
import { logger, logAuth, logPayment, logOrder } from "./utils/logger";
import { z } from "zod";
import "./types";

// Use database storage in production
const dbStorage = new DbStorage();

// ===== VALIDATION SCHEMAS =====

// Auth validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Product validation schemas
const updateProductSpecialSchema = z.object({
  isSpecial: z.boolean(),
});

// Order validation schemas
const orderItemSchema = z.object({
  id: z.number().int().positive(),
  size: z.enum(["500g", "1kg"]),
  quantity: z.number().int().positive().max(100),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  pudoLocation: z.object({
    name: z.string(),
    address: z.string(),
    code: z.string(),
  }).optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  customerEmail: z.string().email().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
});

const updateOrderStatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
  paymentVerified: z.boolean().optional(),
  payfastTransactionId: z.string().optional(),
});

// PayFast validation schemas
const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
});

const fcmNotificationSchema = z.object({
  token: z.string().min(1, "FCM token is required"),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== AUTHENTICATION ROUTES =====
  
  // Register new user (always creates customer role)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { email, password } = validation.data;

      // Check if user already exists
      const existingUser = await dbStorage.getUserByEmail(email);
      if (existingUser) {
        logAuth.register(email, req.ip);
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user - ALWAYS as customer, never allow client to set role
      const user = await dbStorage.createUser({
        email,
        password: hashedPassword,
        role: "customer",
      });

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;

      logAuth.register(email, req.ip);

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      logger.error("Register error", { error, ip: req.ip });
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { email, password } = validation.data;

      // Find user
      const user = await dbStorage.getUserByEmail(email);
      if (!user) {
        logAuth.login(email, false, req.ip);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        logAuth.login(email, false, req.ip);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session and regenerate session ID
      req.session.regenerate((err) => {
        if (err) {
          logger.error("Session regeneration error", { error: err, email });
        }
      });

      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;

      logAuth.login(email, true, req.ip);

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      logger.error("Login error", { error, ip: req.ip });
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Logout
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    const userEmail = req.session.userEmail;
    
    req.session.destroy((err: any) => {
      if (err) {
        logger.error("Logout error", { error: err, email: userEmail });
        return res.status(500).json({ error: "Failed to logout" });
      }
      
      if (userEmail) {
        logAuth.logout(userEmail, req.ip);
      }
      
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await dbStorage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      logger.error("Get user error", { error, userId: req.session.userId });
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Change password
  app.post("/api/auth/change-password", requireAuth, async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = changePasswordSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { currentPassword, newPassword } = validation.data;
      const userId = req.session.userId!;

      // Get user
      const user = await dbStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await dbStorage.updateUserPassword(userId, hashedPassword);

      // Regenerate session for security
      req.session.regenerate((err) => {
        if (err) {
          logger.error("Session regeneration error after password change", { error: err, userId });
        }
      });

      logAuth.passwordChange(user.email, req.ip);

      res.json({ success: true });
    } catch (error) {
      logger.error("Change password error", { error, userId: req.session.userId });
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // ===== PRODUCT ROUTES =====
  // ===== PRODUCT ROUTES =====
  
  // Get all products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await dbStorage.getProducts();
      res.json(products);
    } catch (error) {
      logger.error("Error fetching products", { error });
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const products = await dbStorage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      logger.error("Error fetching products by category", { error, category: req.params.category });
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await dbStorage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      logger.error("Error fetching product", { error, productId: req.params.id });
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Update product special status (admin only)
  app.patch("/api/products/:id/special", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate request body
      const validation = updateProductSpecialSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { isSpecial } = validation.data;
      
      await dbStorage.updateProductSpecial(id, isSpecial);
      logger.info("Product special status updated", { productId: id, isSpecial, adminEmail: req.session.userEmail });
      res.json({ success: true });
    } catch (error) {
      logger.error("Error updating product", { error, productId: req.params.id });
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // ===== ORDERS ROUTES =====
  
  // Create order - calculates total from database prices to prevent manipulation
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = createOrderSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { items, pudoLocation, paymentMethod, customerEmail, customerPhone } = validation.data;

      // Calculate total from database prices (never trust client)
      let calculatedTotal = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await dbStorage.getProductById(item.id);
        if (!product) {
          logger.warn("Product not found in order", { productId: item.id, ip: req.ip });
          return res.status(400).json({ error: `Product ${item.id} not found` });
        }

        // Get correct price based on size
        const unitPrice = item.size === "1kg" 
          ? parseFloat(product.price1kg)
          : parseFloat(product.price500g);

        const itemTotal = unitPrice * item.quantity;
        calculatedTotal += itemTotal;

        // Match schema structure: {productId, productName, price, size, quantity}
        validatedItems.push({
          productId: item.id,
          productName: product.name,
          size: item.size,
          quantity: item.quantity,
          price: unitPrice.toFixed(2),
        });
      }

      const order = await dbStorage.createOrder({
        total: calculatedTotal.toFixed(2),
        items: validatedItems,
        pudoLocation: pudoLocation || null,
        paymentMethod: paymentMethod || null,
        customerEmail: customerEmail || null,
        customerPhone: customerPhone || null,
        payfastTransactionId: null,
      });

      logOrder.created(order.id, order.total, items.length);

      res.json(order);
    } catch (error) {
      logger.error("Error creating order", { error, ip: req.ip });
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await dbStorage.getOrder(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      logger.error("Error fetching order", { error, orderId: req.params.id });
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Get all orders (admin only)
  app.get("/api/orders", requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await dbStorage.getAllOrders();
      res.json(orders);
    } catch (error) {
      logger.error("Error fetching orders", { error, adminEmail: req.session.userEmail });
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Update order status (admin only)
  app.patch("/api/orders/:id/status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Validate request body
      const validation = updateOrderStatusSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { status, paymentVerified, payfastTransactionId } = validation.data;

      await dbStorage.updateOrderStatus(id, status, paymentVerified, payfastTransactionId);
      
      logOrder.updated(id, status);
      
      res.json({ success: true });
    } catch (error) {
      logger.error("Error updating order", { error, orderId: req.params.id });
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // ===== PAYFAST ROUTES =====
  
  // Create PayFast payment - gets amount from database to prevent manipulation
  app.post("/api/payfast/create", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = createPaymentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { orderId } = validation.data;

      // Get order from database to verify amount
      const order = await dbStorage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const config = getPayFastConfig();
      const appUrl = process.env.REPL_SLUG 
        ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
        : "http://localhost:5000";

      const paymentData = {
        merchant_id: config.merchantId,
        merchant_key: config.merchantKey,
        return_url: `${appUrl}/checkout/success?orderId=${orderId}`,
        cancel_url: `${appUrl}/checkout`,
        notify_url: `${appUrl}/api/payfast/notify`,
        amount: order.total, // Use amount from database, not client
        item_name: `The Nosh Co. Order #${orderId}`,
        m_payment_id: orderId,
      };

      const signature = generatePayFastSignature(paymentData, config.passphrase);

      logPayment.created(orderId, order.total, "payfast");

      res.json({
        ...paymentData,
        signature,
        url: config.baseUrl,
      });
    } catch (error) {
      logger.error("Error creating PayFast payment", { error, orderId: req.body.orderId });
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  // PayFast ITN (Instant Transaction Notification) endpoint
  // Handles form-encoded data from PayFast
  app.post("/api/payfast/notify", async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      
      logPayment.itn(payload);

      // Step 1: Verify signature
      const config = getPayFastConfig();
      const signatureValid = verifyPayFastSignature(payload, config.passphrase);

      if (!signatureValid) {
        logger.error("Invalid PayFast signature", { payload });
        return res.status(400).send("Invalid signature");
      }

      // Step 2: Verify merchant ID
      if (payload.merchant_id !== config.merchantId) {
        logger.error("Invalid merchant ID", { payload });
        return res.status(400).send("Invalid merchant ID");
      }

      // Step 3: Server-to-server validation with PayFast
      // Must use exact raw body that PayFast sent (not rebuilt)
      const rawBody = req.rawBody as string;
      if (!rawBody) {
        logger.error("No raw body available for validation", { payload });
        return res.status(400).send("No raw body");
      }
      
      const serverValid = await validatePayFastPayment(rawBody);
      if (!serverValid) {
        logger.error("PayFast server validation failed", { payload });
        return res.status(400).send("Server validation failed");
      }

      // Extract payment info
      const orderId = payload.m_payment_id;
      const paymentStatus = payload.payment_status;
      const transactionId = payload.pf_payment_id;
      const amountGross = parseFloat(payload.amount_gross);

      logger.info("Valid PayFast ITN", { orderId, paymentStatus, transactionId, amountGross });

      // Step 4: Verify payment amount matches order
      if (orderId) {
        const order = await dbStorage.getOrder(orderId);
        if (!order) {
          logger.error("Order not found in PayFast ITN", { orderId });
          return res.status(404).send("Order not found");
        }

        const orderTotal = parseFloat(order.total);
        if (Math.abs(amountGross - orderTotal) > 0.01) {
          logger.error("PayFast amount mismatch", { 
            orderId, 
            expected: orderTotal, 
            received: amountGross 
          });
          return res.status(400).send("Amount mismatch");
        }

        // Step 5: Update order status if payment is complete
        if (paymentStatus === "COMPLETE") {
          try {
            await dbStorage.updateOrderStatus(
              orderId,
              "paid",
              true,
              transactionId
            );
            logPayment.verified(orderId, transactionId, amountGross.toFixed(2));
          } catch (error) {
            logger.error("Failed to update order after payment", { orderId, error });
            logPayment.failed(orderId, "Failed to update order status");
          }
        }
      }

      // Acknowledge receipt
      res.status(200).send("OK");
    } catch (error) {
      logger.error("PayFast ITN Error", { error });
      res.status(500).send("Error processing notification");
    }
  });

  // FCM notification endpoint (stub for sending notifications)
  // TODO (PRODUCTION): Move to proper backend service with Firebase Admin SDK
  app.post("/api/notifications/send", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = fcmNotificationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { token, title, body } = validation.data;

      // This would normally be done server-side with the Firebase Admin SDK
      logger.info("FCM notification request (stub mode)", { 
        token: token.substring(0, 20) + "...", 
        title, 
        body 
      });

      // Stub response - always succeeds in development mode
      res.json({
        success: true,
        message: "Notification logged (stub mode - no actual notification sent)"
      });
    } catch (error) {
      logger.error("FCM Send Error", { error });
      res.status(500).json({ 
        success: false, 
        message: "Error sending notification" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
