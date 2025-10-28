import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DbStorage } from "./db-storage";
import bcrypt from "bcrypt";
import { generatePayFastSignature, verifyPayFastSignature, getPayFastConfig, validatePayFastPayment } from "./payfast";
import { requireAuth, requireAdmin } from "./middleware";
import "./types";

// Use database storage in production
const dbStorage = new DbStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== AUTHENTICATION ROUTES =====
  
  // Register new user (always creates customer role)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Validate email format
      if (!email.includes("@")) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }

      // Check if user already exists
      const existingUser = await dbStorage.getUserByEmail(email);
      if (existingUser) {
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

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Find user
      const user = await dbStorage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Logout
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
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
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
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
      console.error("Error fetching products:", error);
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
      console.error("Error fetching products by category:", error);
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
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Update product special status (admin only)
  app.patch("/api/products/:id/special", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { isSpecial } = req.body;
      
      if (typeof isSpecial !== "boolean") {
        return res.status(400).json({ error: "isSpecial must be a boolean" });
      }
      
      await dbStorage.updateProductSpecial(id, isSpecial);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // ===== ORDERS ROUTES =====
  
  // Create order - calculates total from database prices to prevent manipulation
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { items, pudoLocation, paymentMethod, customerEmail, customerPhone } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Items are required" });
      }

      // Calculate total from database prices (never trust client)
      let calculatedTotal = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await dbStorage.getProduct(item.id);
        if (!product) {
          return res.status(400).json({ error: `Product ${item.id} not found` });
        }

        // Get correct price based on size
        const unitPrice = item.size === "1kg" 
          ? parseFloat(product.price1kg)
          : parseFloat(product.price500g);

        const itemTotal = unitPrice * item.quantity;
        calculatedTotal += itemTotal;

        validatedItems.push({
          id: item.id,
          name: product.name,
          size: item.size,
          quantity: item.quantity,
          unitPrice,
          total: itemTotal,
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

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
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
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Get all orders (admin only)
  app.get("/api/orders", requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await dbStorage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Update order status (admin only)
  app.patch("/api/orders/:id/status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, paymentVerified, payfastTransactionId } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      await dbStorage.updateOrderStatus(id, status, paymentVerified, payfastTransactionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // ===== PAYFAST ROUTES =====
  
  // Create PayFast payment - gets amount from database to prevent manipulation
  app.post("/api/payfast/create", async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }

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

      res.json({
        ...paymentData,
        signature,
        url: config.baseUrl,
      });
    } catch (error) {
      console.error("Error creating PayFast payment:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  // PayFast ITN (Instant Transaction Notification) endpoint
  // Handles form-encoded data from PayFast
  app.post("/api/payfast/notify", async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      
      console.log("=".repeat(80));
      console.log("PayFast ITN Notification Received:");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Payload:", JSON.stringify(payload, null, 2));
      console.log("=".repeat(80));

      // Step 1: Verify signature
      const config = getPayFastConfig();
      const signatureValid = verifyPayFastSignature(payload, config.passphrase);

      if (!signatureValid) {
        console.error("❌ Invalid PayFast signature");
        return res.status(400).send("Invalid signature");
      }

      // Step 2: Verify merchant ID
      if (payload.merchant_id !== config.merchantId) {
        console.error("❌ Invalid merchant ID");
        return res.status(400).send("Invalid merchant ID");
      }

      // Step 3: Server-to-server validation with PayFast
      // Must use exact raw body that PayFast sent (not rebuilt)
      const rawBody = req.rawBody as string;
      if (!rawBody) {
        console.error("❌ No raw body available for validation");
        return res.status(400).send("No raw body");
      }
      
      const serverValid = await validatePayFastPayment(rawBody);
      if (!serverValid) {
        console.error("❌ PayFast server validation failed");
        return res.status(400).send("Server validation failed");
      }

      // Extract payment info
      const orderId = payload.m_payment_id;
      const paymentStatus = payload.payment_status;
      const transactionId = payload.pf_payment_id;
      const amountGross = parseFloat(payload.amount_gross);

      console.log(`✅ Valid ITN for Order ${orderId}`);
      console.log(`   Status: ${paymentStatus}`);
      console.log(`   Transaction ID: ${transactionId}`);
      console.log(`   Amount: R ${amountGross}`);

      // Step 4: Verify payment amount matches order
      if (orderId) {
        const order = await dbStorage.getOrder(orderId);
        if (!order) {
          console.error(`❌ Order ${orderId} not found`);
          return res.status(404).send("Order not found");
        }

        const orderTotal = parseFloat(order.total);
        if (Math.abs(amountGross - orderTotal) > 0.01) {
          console.error(`❌ Amount mismatch: expected R${orderTotal}, got R${amountGross}`);
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
            console.log(`✅ Order ${orderId} marked as paid`);
          } catch (error) {
            console.error(`❌ Failed to update order ${orderId}:`, error);
          }
        }
      }

      // Acknowledge receipt
      res.status(200).send("OK");
    } catch (error) {
      console.error("PayFast ITN Error:", error);
      res.status(500).send("Error processing notification");
    }
  });

  // FCM notification endpoint (stub for sending notifications)
  // TODO (PRODUCTION): Move to proper backend service with Firebase Admin SDK
  app.post("/api/notifications/send", async (req: Request, res: Response) => {
    try {
      const { token, title, body } = req.body;

      // This would normally be done server-side with the Firebase Admin SDK
      console.log("=".repeat(80));
      console.log("FCM Push Notification Request (STUB MODE):");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Token:", token);
      console.log("Title:", title);
      console.log("Body:", body);
      console.log("NOTE: In production, this would send via Firebase Admin SDK");
      console.log("=".repeat(80));

      // Stub response - always succeeds in development mode
      res.json({
        success: true,
        message: "Notification logged (stub mode - no actual notification sent)"
      });
    } catch (error) {
      console.error("FCM Send Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error sending notification" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
