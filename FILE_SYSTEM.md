# The Nosh Co. - File System Structure

## 📁 Project Overview

This document explains the folder structure and organization of The Nosh Co. PWA e-commerce application.

---

## 🗂️ Root Directory

```
the-nosh-co/
├── client/          # Frontend React application
├── server/          # Backend Express API
├── shared/          # Shared types and schemas
├── public/          # Static assets
├── attached_assets/ # User-uploaded assets
└── [config files]   # Various configuration files
```

---

## 📱 `/client` - Frontend Application

The React + TypeScript PWA that customers interact with.

### `/client/src`
Main source code for the frontend.

#### `/client/src/pages`
Individual page components for routing:
- `HomePage.tsx` - Landing page with hero and featured products
- `CategoryPage.tsx` - Product listings by category
- `ProductDetailPage.tsx` - Single product view
- `BasketPage.tsx` - Shopping cart review
- `CheckoutPage.tsx` - Order submission with PUDO selection
- `OrderHistoryPage.tsx` - Customer order tracking
- `AdminDashboard.tsx` - Order management for admin
- `not-found.tsx` - 404 error page

#### `/client/src/components`
Reusable UI components:
- `Header.tsx` - Navigation with basket icon
- `ProductCard.tsx` - Product display card
- `BasketModal.tsx` - Slide-out shopping cart
- `Footer.tsx` - Site footer with links
- `ThemeProvider.tsx` - Dark/light mode handling

#### `/client/src/components/ui`
Shadcn UI component library (60+ components):
- `button.tsx`, `card.tsx`, `dialog.tsx`, etc.
- Pre-built, accessible, styled components
- Used throughout the app for consistency

#### `/client/src/contexts`
React Context providers for global state:
- `OrderContext.tsx` - Shopping basket and order state management
- Handles localStorage persistence for demo mode

#### `/client/src/data`
Static data files:
- `products.ts` - All 58 products with pricing (seed data)
- `pudoLocations.ts` - PUDO pickup location options
- Used by frontend until Phase 2 API integration

#### `/client/src/lib`
Utility functions and configurations:
- `utils.ts` - Helper functions (class names, formatting)
- `queryClient.ts` - TanStack Query configuration for API calls
- `firebase.ts` - Firebase Cloud Messaging setup

#### `/client/src/hooks`
Custom React hooks:
- `use-toast.ts` - Toast notification system
- Reusable logic across components

#### `/client/src/styles`
Global styling:
- `index.css` - Tailwind base, theme variables, custom utilities
- Defines cream/black/white color scheme
- Jo Malone-inspired aesthetic

---

## 🖥️ `/server` - Backend API

The Express + TypeScript backend for production payments and orders.

### Server Files

#### Core Server Files
- `index.ts` - Application entry point, Express setup, middleware
- `routes.ts` - All API route definitions (auth, products, orders, PayFast)
- `vite.ts` - Vite dev server integration for development
- `middleware.ts` - Authentication/authorization guards (`requireAuth`, `requireAdmin`)
- `types.ts` - TypeScript session type augmentation

#### Database Layer
- `db.ts` - Drizzle ORM database connection
- `db-storage.ts` - Database storage implementation (DbStorage class)
- `storage.ts` - Storage interface definition (IStorage)
- **Note:** `MemStorage` in `storage.ts` is legacy - production uses `DbStorage`

#### Payment Integration
- `payfast.ts` - PayFast signature generation and ITN validation
- Handles payment security and server-to-server verification

#### Data Seeding
- `seed.ts` - Seeds 58 products into database
- `seed-admin.ts` - Creates admin user (admin@thenoshco.co.za)

---

## 🔗 `/shared` - Shared Code

Code shared between frontend and backend.

- `schema.ts` - Drizzle ORM database schema definitions
  - Users table (authentication)
  - Products table (inventory)
  - Orders table (order tracking)
  - Zod validation schemas for type safety

---

## 🌍 `/public` - Static Assets

Public files served directly by the web server.

- `manifest.json` - PWA manifest (app name, icons, colors)
- `service-worker.js` - Service worker for offline functionality
- `firebase-messaging-sw.js` - Firebase push notification worker
- `icons/` - App icons for various sizes (PWA, mobile)

---

## 📎 `/attached_assets` - User Assets

User-uploaded or attached files (currently empty).

- Future: Product images
- Future: Generated images
- Referenced in frontend with `@assets/...` imports

---

## ⚙️ Configuration Files (Root)

### Build & Development
- `package.json` - Node.js dependencies and scripts
- `vite.config.ts` - Vite bundler configuration
- `tsconfig.json` - TypeScript compiler settings
- `tailwind.config.ts` - Tailwind CSS theme configuration
- `postcss.config.js` - PostCSS plugins

### Database
- `drizzle.config.ts` - Drizzle ORM configuration (DO NOT EDIT)
- Connected to Replit PostgreSQL database

### Code Quality
- `.eslintrc.json` - ESLint linting rules (if present)
- `.prettierrc` - Code formatting rules (if present)

### Documentation
- `replit.md` - Replit project metadata and preferences
- `PRODUCTION_DEPLOYMENT.md` - Production deployment guide
- `FILE_SYSTEM.md` - This file!

---

## 🔄 Data Flow

### Demo Mode (Current - Phase 1)
```
Frontend (localStorage) → Manual WhatsApp → You
```
- Basket: localStorage
- Orders: localStorage
- No database interaction for customers

### Production Mode (Phase 2 - Ready)
```
Frontend → Backend API → PostgreSQL → PayFast
```
- Basket: Still localStorage (for speed)
- Orders: Database via `/api/orders`
- Payments: PayFast via `/api/payfast/*`
- Admin: Database via `/api/admin/*`

---

## 📊 Key Directories by Feature

### Shopping Experience
- **Product Browsing:** `/client/src/pages/CategoryPage.tsx`, `/client/src/data/products.ts`
- **Shopping Cart:** `/client/src/components/BasketModal.tsx`, `/client/src/contexts/OrderContext.tsx`
- **Checkout:** `/client/src/pages/CheckoutPage.tsx`, `/client/src/data/pudoLocations.ts`

### Admin Management
- **Dashboard:** `/client/src/pages/AdminDashboard.tsx`
- **APIs:** `/server/routes.ts` (admin endpoints with `requireAdmin`)

### Payment Processing
- **Frontend:** `/client/src/pages/CheckoutPage.tsx` (Apple Pay UI ready)
- **Backend:** `/server/payfast.ts`, `/server/routes.ts` (PayFast endpoints)

### Database
- **Schema:** `/shared/schema.ts` (tables, types, validation)
- **Connection:** `/server/db.ts` (Drizzle setup)
- **Operations:** `/server/db-storage.ts` (CRUD methods)

---

## 🎨 Design System

### Styling
- **Theme:** `/client/src/styles/index.css` (CSS variables, Tailwind config)
- **Colors:** Cream (#F5F3EE), Black, White
- **Typography:** Playfair Display (serif headings), Inter (body)
- **Components:** `/client/src/components/ui/*` (60+ Shadcn components)

### Assets
- **Icons:** Lucide React (imported in components)
- **Logos:** React Icons (company logos when needed)
- **Images:** `/attached_assets/*` (currently empty, botanical SVGs via Lucide)

---

## 🚀 Important Notes

### DO NOT EDIT
- `drizzle.config.ts` - Auto-configured by Replit
- `vite.config.ts` - Optimized Vite setup
- `package.json` - Use packager tool to add dependencies

### Safe to Edit
- `/client/src/*` - All frontend code
- `/server/routes.ts` - Add new API endpoints
- `/shared/schema.ts` - Database schema (use `npm run db:push --force`)
- `/client/src/styles/index.css` - Theme customization

### Generated/Auto-Updated
- `/client/src/components/ui/*` - Shadcn components (don't modify manually)
- `node_modules/` - Installed packages (never commit)

---

## 📝 Quick Reference

### Run the App
```bash
npm run dev
```
Server starts on port 5000 (frontend + backend together)

### Seed Database
```bash
tsx server/seed.ts        # Add 58 products
tsx server/seed-admin.ts  # Create admin user
```

### Database Migrations
```bash
npm run db:push --force   # Sync schema to database
```

### API Endpoints
See `/server/routes.ts` for complete list:
- `/api/auth/*` - Authentication
- `/api/products/*` - Product catalog
- `/api/orders/*` - Order management
- `/api/payfast/*` - Payment processing

---

## 🎯 Finding Things

**Need to change product data?**  
→ `/client/src/data/products.ts` (demo) or `/server/seed.ts` (production)

**Need to update checkout flow?**  
→ `/client/src/pages/CheckoutPage.tsx`

**Need to modify payment logic?**  
→ `/server/payfast.ts` and `/server/routes.ts`

**Need to change colors/styling?**  
→ `/client/src/styles/index.css` and `tailwind.config.ts`

**Need to add new API endpoint?**  
→ `/server/routes.ts`

**Need to modify database schema?**  
→ `/shared/schema.ts` then run `npm run db:push --force`

---

This file system is optimized for a full-stack TypeScript PWA with both demo (localStorage) and production (database + PayFast) capabilities. Everything is organized for easy navigation and future expansion! 🚀
