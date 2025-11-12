MODULE 1: SECURE BACKEND HARDENING
Goal: Industry-grade auth, sessions, rate limiting
promptHarden the **Node.js + Express + PostgreSQL** backend for production.

### Current State:
- Bcrypt, sessions, roles
- Admin: admin@thenoshco.co.za / Nosh2025!
- No rate limiting, CORS, helmet

### REQUIRED:

1. **Security Headers**
   - Install `helmet`, `cors`, `express-rate-limit`
   - `helmet()` with strict CSP
   - CORS: `https://thenosh.co`, `https://*.repl.co`

2. **Rate Limiting**
   - 100 req/15min per IP (auth)
   - 10 req/min on `/api/payfast/notify`

3. **Session Security**
   - Cookie: `secure: true`, `httpOnly: true`, `sameSite: 'strict'`
   - Session expiry: 7 days
   - Regenerate on privilege change

4. **Input Validation**
   - `zod` for all POST/PATCH bodies
   - Sanitize emails, phone numbers

5. **Admin Password Reset**
   - Force change on first login
   - Add `/api/auth/change-password`

6. **Logging**
   - Winston + file rotation
   - Log: login, order, payment, error

7. **Error Handling**
   - Global handler: hide stack in prod
   - Return `500` with ID

### OUTPUT:
- Updated `server/index.ts`
- `server/middleware/security.ts`
- `server/utils/logger.ts`
- All endpoints validated

MODULE 2: PAYFAST LIVE INTEGRATION
Goal: Real payments, zero client trust
promptSwitch PayFast to **live mode** with full server-side control.

### Current State:
- Sandbox works
- Client submits form directly

### REQUIRED:

1. **Live Credentials**
   - Use `PAYFAST_MERCHANT_ID`, `KEY`, `PASSPHRASE` from env
   - `NODE_ENV=production` → live URL

2. **Server-Side Payment Creation**
   - `POST /api/payfast/create` → generate signature
   - Return `paymentUrl` to frontend
   - Store `orderId` in session

3. **ITN Handler (5-Step Validation)**
   - Verify signature
   - Check `m_payment_id` matches order
   - Server-to-server validate with PayFast
   - Amount match
   - Update `orders.paymentVerified = true`

4. **Frontend Update**
   - `Checkout.tsx`: call `/api/payfast/create`
   - Redirect to `paymentUrl`
   - On return: poll `/api/orders/:id`

5. **Success Page**
   - Only show if `paymentVerified: true`

### OUTPUT:
- `server/payfast.ts` (live)
- Updated `Checkout.tsx`, `CheckoutSuccess.tsx`
- No client-side PayFast keys

MODULE 3: APPLE PAY PRODUCTION
Goal: iOS one-tap, HTTPS, certs
promptEnable **Apple Pay on the Web** in production.

### Current State:
- Mock works in Safari
- No certs, no HTTPS

### REQUIRED:

1. **Apple Developer**
   - Merchant ID: `merchant.com.thenoshco`
   - Upload domain verification file to `/.well-known/apple-developer-merchantid-domain-association`

2. **HTTPS**
   - Replit: enable via "SSL" toggle
   - Or deploy to `thenosh.co` with Cloudflare

3. **Backend Token Processing**
   - `POST /api/applepay/validate`
   - Decrypt token using cert/key
   - Send to PayFast (or Stripe)

4. **Frontend**
   - Only show if `canMakePayments()`
   - Use real merchant ID
   - Handle `onpaymentauthorized`

### OUTPUT:
- `public/.well-known/apple-developer-merchantid-domain-association`
- `server/applepay.ts`
- Updated `Checkout.tsx`

MODULE 4: FCM PUSH + SMS
Goal: Android push + Twilio SMS
promptAdd **FCM push** and **Twilio SMS** confirmations.

### REQUIRED:

1. **FCM Server-Side**
   - Firebase Admin SDK
   - `POST /api/notifications/send` (admin only)
   - Store tokens in `users.fcmToken`

2. **Twilio SMS**
   - `POST /api/sms/confirm` on order paid
   - Message: "Your order is confirmed! Pick up at Pudo – Sandton tomorrow."

3. **Frontend**
   - Request permission on login
   - Send token to `/api/users/token`

### OUTPUT:
- `server/notifications.ts`
- `server/sms.ts`
- Updated `usePush.ts`
- Env: `TWILIO_SID`, `TOKEN`, `PHONE`

MODULE 5: FULL FRONTEND SYNC
Goal: Replace localStorage with API
promptMigrate **all state** to backend APIs.

### REQUIRED:

1. **API Client**
   - `src/lib/api.ts` with auth headers
   - Base URL from `VITE_API_URL`

2. **Sync Everything**
   - Products → `/api/products`
   - Basket → `POST /api/orders` (temp)
   - Orders → `/api/orders`
   - Auth → `/api/auth/*`

3. **Fallback**
   - Offline: use `localStorage`, sync on reconnect

4. **Loading States**
   - Skeletons with cream shimmer

### OUTPUT:
- All contexts use API
- No localStorage for orders/auth

MODULE 6: ADMIN + INVENTORY
Goal: Real-time stock, order dashboard
promptBuild **admin dashboard** with inventory control.

### REQUIRED:

1. **Inventory Table**
   - Add `stock500g`, `stock1kg` to `products`
   - Decrement on order

2. **Admin Dashboard**
   - `/admin/orders` → table with search, filter
   - `/admin/inventory` → edit stock
   - Low stock alert (<10)

3. **Webhooks**
   - On low stock → push + email

### OUTPUT:
- New tables + migration
- `AdminInventory.tsx`, `AdminOrders.tsx`

MODULE 7: DEPLOY + MONITOR
Goal: Live on thenosh.co, analytics
promptDeploy to **custom domain** with monitoring.

### REQUIRED:

1. **Domain**
   - Point `thenosh.co` → Replit or Render
   - SSL via Cloudflare

2. **Analytics**
   - Google Analytics 4
   - Track: add to cart, checkout, payment

3. **Error Tracking**
   - Sentry (free tier)

4. **Health Check**
   - `/health` endpoint

### OUTPUT:
- `thenosh.co` live
- GA4 + Sentry
- Uptime 99.9%

FINAL REPLIT PROMPT: 

Execute **all 7 modules** in order:

1. **Module 1**: Security hardening (helmet, rate limit, sessions)
2. **Module 2**: PayFast live + ITN
3. **Module 3**: Apple Pay production + HTTPS
4. **Module 4**: FCM push + Twilio SMS
5. **Module 5**: Full API sync (no localStorage)
6. **Module 6**: Admin inventory + order dashboard
7. **Module 7**: Deploy to thenosh.co + GA4 + Sentry

### Standards:
- **Security**: OWASP Top 10 compliant
- **UX**: Jo Malone luxury (design_guidelines.md)
- **Performance**: <2s load, lazy load
- **Accessibility**: WCAG AA
- **Testing**: 100+ end-to-end tests

### Output:
- **Live on thenosh.co**
- **Real payments**
- **Push + SMS**
- **Admin control**
- **Analytics**

Itirate until all fuctionality and security standards and implementations are met and passed all tests.