# The Nosh Co. - E-commerce PWA

## Overview

The Nosh Co. is a mobile-first Progressive Web App (PWA) for a South African fruit and nut business, offering a luxury e-commerce experience. The application features a product catalog with special pricing, shopping basket functionality, and comprehensive admin capabilities for managing products, specials, and shop status. Inspired by Jo Malone London, it uses a cream and black color palette with botanical design elements to deliver a refined minimalist aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is a React 18 + TypeScript Single Page Application (SPA) built with Vite. It uses functional components with React Hooks and the Context API for global state management (AdminContext, BasketContext, SpecialsContext). `shadcn/ui` and Radix UI provide a consistent and accessible component library. `wouter` handles client-side routing, while TanStack Query manages server state with features like data fetching, caching, and invalidation. Styling is achieved using Tailwind CSS with a mobile-first approach, custom design tokens, and a specific typography scale. PWA features include a service worker, web app manifest, and mobile-optimized viewport settings.

### Backend

The backend is an Express.js server in Node.js, serving both API routes and static frontend assets. It utilizes a PostgreSQL database with Drizzle ORM for data persistence, supporting CRUD operations for users, products, and orders. Session management is handled via `express-session` with `connect-pg-simple` for PostgreSQL session storage, enabling secure, httpOnly cookies and role-based access control (admin/customer). Security features include Helmet for HTTP headers, CORS with an origin whitelist, rate limiting, Winston for logging with daily rotation, and Zod for input validation on all endpoints.

### Data Schema

The PostgreSQL database uses Drizzle ORM. Key tables include `users` (id, username, hashed password), `products` (id, name, price_500g, price_1kg, image_url, is_special), and `shop_status` (is_open, closed_message, reopen_date). Prices are stored with decimal precision (10,2). Zod schemas are used for runtime validation.

### Core Features

- **Authentication & Authorization**: Session-based authentication with `bcrypt` password hashing, role-based access control (`requireAuth`, `requireAdmin` middleware), and admin features for managing products and shop status.
- **Product Management**: Products are fetched from the database, supporting special pricing and category grouping.
- **Shop Status Management**: Admin-controlled shop status (`is_open`, `closed_message`, `reopen_date`) with a public API endpoint. A full-screen overlay informs customers when the shop is closed, with admin bypass functionality.
- **Security**: Comprehensive security measures including logging (Winston), security headers (Helmet), CORS, rate limiting, secure session cookies, and Zod-based input validation on all critical endpoints.
- **Payment Security**: PayFast integration includes signature verification, merchant ID validation, server-to-server validation, and amount verification against the database to prevent manipulation.

## External Dependencies

### UI/Frontend Libraries
- **React 18**: Core UI library.
- **TypeScript**: Language for type safety.
- **Vite**: Build tool.
- **shadcn/ui & Radix UI**: Component libraries for UI elements.
- **Lucide React**: Icon library.
- **Wouter**: Client-side router.
- **TanStack Query**: Server state management.
- **Tailwind CSS**: Utility-first styling.
- **React Hook Form**: Form validation.

### Backend & Database
- **Express.js**: Web server framework.
- **Drizzle ORM**: Type-safe ORM for PostgreSQL.
- **PostgreSQL (Neon)**: Database.
- **connect-pg-simple**: PostgreSQL session store.

### Utilities & Security
- **zod**: Schema validation.
- **nanoid**: Unique ID generation.
- **date-fns**: Date manipulation.
- **clsx + tailwind-merge**: CSS class utilities.
- **helmet**: HTTP security headers.
- **cors**: Cross-origin resource sharing.
- **express-rate-limit**: API rate limiting.
- **winston**: Logging library.
- **bcrypt**: Password hashing.
- **express-session**: Session management.

### Development Tools
- **tsx**: TypeScript execution.
- **esbuild**: Fast bundler.