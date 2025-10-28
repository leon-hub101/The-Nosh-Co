import bcrypt from "bcrypt";
import { DbStorage } from "./db-storage";

async function seedAdmin() {
  console.log("🔐 Seeding admin user...");

  const dbStorage = new DbStorage();

  try {
    // Check if admin already exists
    const existingAdmin = await dbStorage.getUserByEmail("admin@thenoshco.co.za");
    
    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Nosh2025!", 10);
    const admin = await dbStorage.createUser({
      email: "admin@thenoshco.co.za",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Password: Nosh2025!`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    throw error;
  }
}

seedAdmin();
