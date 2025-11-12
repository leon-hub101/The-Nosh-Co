# The Nosh Co. - E-commerce PWA

## Overview

The Nosh Co. is a mobile-first Progressive Web App (PWA) for a South African fruit and nut business. The application features a luxury e-commerce experience inspired by Jo Malone London's sophisticated aesthetic, with a cream and black color palette, botanical design elements, and refined minimalism. The app provides a product catalog with special pricing, shopping basket functionality, and admin capabilities for managing product specials.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React + TypeScript SPA**: The application uses React 18 with TypeScript in a Single Page Application architecture, built with Vite for optimal development experience and build performance.

**Component Strategy**: 
- Functional components with React Hooks for state management
- Context API for global state (AdminContext, BasketContext, SpecialsContext)
- shadcn/ui component library for consistent UI primitives
- Radix UI primitives for accessible, unstyled base components

**Routing**: wouter library for lightweight client-side routing with a simple route structure (Home page + 404 fallback)

**State Management**:
- React Context for cross-cutting concerns (authentication, basket, specials)
- Local component state for UI interactions
- LocalStorage persistence for special product flags
- TanStack Query (React Query) for server state management (configured but not yet actively used)

**Styling Approach**:
- Tailwind CSS utility-first framework
- Custom design tokens defined in tailwind.config.ts
- CSS variables for theming (light mode defined, dark mode prepared)
- Mobile-first responsive design with breakpoint-based modifiers
- Typography: Playfair Display (serif) for headings, Inter (sans-serif) for body text

**PWA Implementation**:
- Service worker support configured in Vite
- Web app manifest (manifest.json) for installability
- Mobile-optimized viewport settings
- Theme color integration for native app shell

### Backend Architecture

**Express.js Server**: Node.js backend with Express framework serving both API routes and static frontend assets.

**Development vs Production**:
- Development: Vite dev server middleware integrated with Express
- Production: Pre-built static assets served from dist/public

**Storage Layer**: 
- PostgreSQL database with Drizzle ORM (active)
- DbStorage implementation for production use
- Interface-based design (IStorage) with MemStorage fallback
- Supports users, products, and orders CRUD operations
- All data persisted to database with proper validation

**Session Management**: 
- connect-pg-simple PostgreSQL session store (active)
- Secure session cookies with httpOnly, sameSite: "lax"
- 7-day session expiry
- Session secret from environment variable
- Supports user authentication and role-based access

### Data Schema

**Database**: PostgreSQL with Drizzle ORM configured but not actively used (data currently mocked)

**Schema Design**:
- `users` table: id (UUID), username (unique), password (hashed)
- `products` table: id (auto-increment), name, price_500g, price_1kg, image_url, is_special flag
- Decimal precision for prices (10,2) to handle South African Rand accurately
- Zod schemas for runtime validation derived from Drizzle schema

**Current Data Flow**: 
- Products hardcoded in Home.tsx component with mock data
- Specials state managed via SpecialsContext + localStorage
- Basket state ephemeral (lost on page refresh)

### Authentication & Authorization

**Backend Authentication**: 
- bcrypt password hashing (10 salt rounds)
- Express session-based authentication
- PostgreSQL session persistence
- Password change endpoint with current password validation
- Registration always creates "customer" role (admin role cannot be self-assigned)

**Authorization Model**: 
- Role-based access control (admin/customer)
- Middleware: requireAuth (any authenticated user), requireAdmin (admin only)
- Admin features: view all orders, update order status, toggle product specials
- Customer features: create orders, view own order details

### Security Implementation (Module 1 - Completed)

**Logging & Monitoring**:
- Winston logger with rotating file transports
- Daily log rotation with 14-day retention
- Separate log files: auth.log, payment.log, error.log, combined.log
- Structured JSON logging with contextual metadata
- Request-level logging for all API calls
- Error tracking with unique error IDs

**Security Middleware**:
- Helmet security headers (CSP, XSS protection, frame guards)
- CORS with origin whitelist (thenosh.co, localhost, *.repl.co, *.replit.dev)
- Rate limiting:
  - Auth endpoints: 100 requests/15min per IP
  - PayFast ITN: 10 requests/minute
- Secure session cookies (httpOnly, sameSite, secure in production)

**Input Validation**:
- Zod validation on all POST/PATCH endpoints
- Auth: email format, password length, current password verification
- Products: boolean validation for special status
- Orders: item structure, quantity limits (max 100), PUDO location schema
- Order status: enum validation (pending, paid, processing, shipped, delivered, cancelled)
- PayFast: UUID order ID validation
- FCM: token, title, body required fields

**Payment Security**:
- PayFast signature verification (HMAC)
- Merchant ID validation
- Server-to-server payment validation
- Amount verification against database (prevents client manipulation)
- Transaction ID tracking

### Design System

**Color Palette**:
- Cream backgrounds (#F5F3EE, #E5E3DF)
- Sage green accents (#8B9F8D, #B5C4B6)
- Primary action color: Green (#22c55e) for buttons, badges, admin FAB
- Special badges: Orange (#f97316, #ea580c)
- Black/white for branding and text

**Typography Scale**:
- H1: 3xl-5xl, font-serif, light weight, wide tracking (page titles)
- H2: 2xl-3xl, font-serif, light weight (section headers)
- H3: lg-xl, font-serif, normal weight (product names)
- Body: base, font-sans, relaxed leading
- Buttons/labels: sm, font-sans, widest tracking, uppercase

**Spacing System**: Tailwind's 4px-based scale with emphasis on 4, 8, 12, 16, 24 units for elegant breathing room

**Layout Patterns**:
- Mobile: px-6 padding, full-width components
- Desktop: max-w-6xl container, px-8 to px-12 padding
- Product grid: 1-2-3 column responsive grid with 8-12 gap
- Portrait aspect ratios (4:5) for product images

## External Dependencies

### UI Component Libraries
- **shadcn/ui**: Pre-built accessible components (accordion, alert-dialog, badge, button, card, dialog, dropdown-menu, form, input, label, popover, select, separator, toast, and many more)
- **Radix UI**: Headless UI primitives for accessibility and keyboard navigation
- **Lucide React**: Icon library for UI elements

### Frontend Frameworks & Tools
- **React 18**: UI framework with hooks and context
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Build tool and dev server with HMR
- **Wouter**: Minimal client-side router
- **TanStack Query**: Server state management (configured, minimal usage)
- **React Hook Form**: Form validation with @hookform/resolvers
- **Tailwind CSS**: Utility-first styling framework
- **PostCSS + Autoprefixer**: CSS processing

### Backend Framework & Database
- **Express.js**: Web server framework
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **drizzle-zod**: Zod schema generation from Drizzle schemas
- **@neondatabase/serverless**: PostgreSQL driver for Neon (serverless)
- **connect-pg-simple**: PostgreSQL session store for Express (configured, not active)

### Development Tools
- **tsx**: TypeScript execution for dev server
- **esbuild**: Fast bundler for production server code
- **Replit plugins**: Runtime error modal, cartographer, dev banner (dev environment only)

### Utilities
- **zod**: Schema validation
- **nanoid**: Unique ID generation
- **date-fns**: Date manipulation
- **clsx + tailwind-merge**: Conditional className utilities
- **class-variance-authority**: Component variant management

### Backend Security & Dependencies
- **helmet**: HTTP security headers
- **cors**: Cross-origin resource sharing with origin whitelist
- **express-rate-limit**: API rate limiting and DDoS protection
- **winston**: Production-grade logging with rotation
- **winston-daily-rotate-file**: Daily log rotation with retention policies
- **zod**: Runtime schema validation
- **bcrypt**: Password hashing
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Product Images (Module 2 - Completed)

**Stock Photo Integration**:
- 58 high-quality stock photos sourced for all products
- Images stored in `attached_assets/stock_images/` directory
- Hardened static file serving via Express middleware
- Security features: path.resolve, fallthrough: false, index: false, extensions: false
- All database records updated with image_url references

**Image Categories**:
- Nuts: Premium almonds, cashews, macadamias, pecans, pistachios, walnuts, brazil nuts
- Dried Fruits: Apricots, dates, figs, cranberries, mango, prunes, raisins, cherries
- Sweet Snacks: Caramel nuts, gummies, jelly products, popcorn, wine gums
- Baking/Health: Seeds (chia, pumpkin, sunflower, sesame), flours, oats, quinoa, cocoa

### Current Integration Status
- **Database**: PostgreSQL active with 58 products seeded
- **Product Images**: All 58 products have stock photos (Module 2 complete)
- **Session Management**: Active with PostgreSQL persistence
- **API Routes**: Full CRUD for users, products, orders, auth, PayFast payments
- **Security**: Module 1 complete (logging, validation, rate limiting, secure sessions, hardened static assets)
- **Frontend-Backend Sync**: Pending Module 3 (frontend still uses localStorage)