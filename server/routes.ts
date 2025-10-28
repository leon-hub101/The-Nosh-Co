import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DbStorage } from "./db-storage";

// Use database storage in production
const dbStorage = new DbStorage();

export async function registerRoutes(app: Express): Promise<Server> {
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
  app.patch("/api/products/:id/special", async (req: Request, res: Response) => {
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

  // ===== EXISTING ROUTES =====
  // PayFast ITN (Instant Transaction Notification) endpoint
  // This is a stub for production implementation
  // TODO (PRODUCTION): Implement proper PayFast signature verification
  app.post("/api/payfast/notify", async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      
      console.log("=".repeat(80));
      console.log("PayFast ITN Notification Received:");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Payload:", JSON.stringify(payload, null, 2));
      console.log("=".repeat(80));

      // TODO (PRODUCTION):
      // 1. Verify PayFast signature
      // 2. Validate merchant ID and key
      // 3. Verify payment amount matches order
      // 4. Update order status in database
      // 5. Send confirmation email to customer
      // 6. Log transaction for audit trail

      // For now, just acknowledge receipt
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
