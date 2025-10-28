# Production Security & Features TODO

## 🚨 Critical Security Issues (Must Fix Before Production)

### 1. PayFast Payment Verification
**Current State (MVP/Sandbox):**
- Client-side payment form submission
- No server-side verification
- Hardcoded sandbox credentials in frontend
- Order completion based on URL parameter only

**Required for Production:**
1. **Server-Side Payment Creation**
   - Move PayFast merchant credentials to server environment variables
   - Create payment endpoint: `POST /api/payments/create`
   - Generate payment signature on backend
   - Return signed payment URL to client

2. **ITN (Instant Transaction Notification) Handler**
   - ✅ Endpoint created: `POST /api/payfast/notify` (stub in `server/routes.ts`)
   - ⚠️ TODO: Verify PayFast signature
   - ⚠️ TODO: Validate payment amount and merchant ID
   - ⚠️ TODO: Update order status in database only after verification
   - ✅ Logging implemented (console output)

3. **Order Status Verification**
   - Replace localStorage order status with database
   - Fetch verified order from backend: `GET /api/orders/{id}`
   - Only mark order as paid after ITN confirmation
   - Prevent URL parameter spoofing

**Files to Update:**
- `server/routes.ts` - Add payment endpoints
- `client/src/pages/Checkout.tsx` - Call API instead of direct form submission
- `client/src/pages/CheckoutSuccess.tsx` - Fetch order status from API
- `client/src/contexts/OrderContext.tsx` - Remove client-side status updates

### 2. Environment Variables
**Required:**
```env
# PayFast (Server-side only)
PAYFAST_MERCHANT_ID=your_production_id
PAYFAST_MERCHANT_KEY=your_production_key
PAYFAST_PASSPHRASE=your_passphrase

# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Apple Pay
APPLE_MERCHANT_ID=merchant.com.thenoshco
APPLE_MERCHANT_CERT_PATH=/path/to/cert.pem
APPLE_MERCHANT_KEY_PATH=/path/to/key.pem

# Database
DATABASE_URL=your_production_db

# Session
SESSION_SECRET=already_configured
```

### 3. Database Schema
**Add Orders Table:**
```sql
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  status VARCHAR(50) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,
  pudo_location JSONB,
  payment_verified BOOLEAN DEFAULT FALSE,
  payfast_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 📋 Other Production Improvements

### 4. Firebase Cloud Messaging (FCM) - Push Notifications
**Current State (Unit 5 Implementation):**
- ✅ Firebase SDK configured in `client/src/firebase.ts`
- ✅ Service worker setup for push notifications (`public/firebase-messaging-sw.js`)
- ✅ FCM token generation and permission requests
- ✅ Real push notification support via Firebase
- ⚠️ Server key stored client-side (not secure)
- ⚠️ Notification sending via client (should be server-side)

**Required for Production:**
1. **Server-Side Firebase Admin SDK**
   - Install Firebase Admin SDK on backend
   - Move FCM server key to environment variables
   - Create endpoint: `POST /api/notifications/send`
   - Implement server-side notification dispatch

2. **Token Management**
   - Store user FCM tokens in database
   - Implement token refresh logic
   - Associate tokens with user accounts
   - Clean up expired tokens

3. **Firebase Configuration**
   - Add Firebase project credentials to server environment
   - Set up proper security rules
   - Enable production-grade messaging quota

**Files to Update:**
- `server/routes.ts` - Add FCM Admin SDK integration
- `client/src/firebase.ts` - Remove server key from client
- `client/src/hooks/usePush.ts` - Send tokens to backend for storage
- Add `FIREBASE_SERVICE_ACCOUNT_KEY` to environment variables

**Environment Variables:**
```env
# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### 5. Apple Pay Integration
**Current State (Unit 5 Implementation):**
- ✅ Apple Pay button with Payment Request API
- ✅ Apple Pay merchant meta tag in `index.html`
- ✅ Mock payment flow redirecting to success page
- ⚠️ No real Apple Pay processing
- ⚠️ Requires HTTPS and Apple Developer merchant ID for production

**Required for Production:**
1. **Apple Developer Setup**
   - Register Apple Merchant ID at https://developer.apple.com
   - Create merchant identity certificate
   - Configure domains in Apple Developer portal
   - Add merchant domain validation file

2. **Backend Payment Processing**
   - Process Apple Pay payment tokens via PayFast (if supported)
   - OR integrate with Apple Pay-compatible payment processor
   - Decrypt and validate Apple Pay tokens
   - Return payment confirmation

3. **HTTPS Requirement**
   - Apple Pay only works on HTTPS domains
   - Configure SSL certificate on production deployment
   - Ensure all payment endpoints use HTTPS

**Files to Update:**
- `client/src/pages/Checkout.tsx` - Process real Apple Pay tokens
- `server/routes.ts` - Add Apple Pay token processing endpoint
- Add Apple merchant domain validation file to `public/.well-known/`

**Environment Variables:**
```env
# Apple Pay
APPLE_MERCHANT_ID=merchant.com.thenoshco
APPLE_MERCHANT_CERT_PATH=/path/to/cert.pem
APPLE_MERCHANT_KEY_PATH=/path/to/key.pem
```

**Resources:**
- Apple Pay Web Documentation: https://developer.apple.com/documentation/apple_pay_on_the_web
- PayFast Apple Pay Support: https://developers.payfast.co.za/docs#apple_pay

### 6. Product Management
- Replace hardcoded products with database
- Add product images to cloud storage
- Implement admin API for product CRUD
- Add inventory management

### 7. Order History & Management
**Current State (Unit 5 Implementation):**
- ✅ Order history page at `/orders` (admin only)
- ✅ Orders persisted in localStorage
- ✅ Order display with status, items, and PUDO location
- ⚠️ localStorage not suitable for production
- ⚠️ No order search or filtering

**Required for Production:**
1. **Database Persistence**
   - Migrate order history from localStorage to database
   - Add orders table (see Section 3)
   - Implement proper order management API

2. **Order Management Features**
   - Add order search and filtering
   - Implement order status updates
   - Add order cancellation
   - Add customer order tracking

3. **Customer Access**
   - Allow customers to view their own orders
   - Implement order lookup by email/phone
   - Add order confirmation emails

**Files to Update:**
- `client/src/contexts/OrderContext.tsx` - Replace localStorage with API calls
- `client/src/pages/OrderHistory.tsx` - Add filtering and search
- `server/routes.ts` - Add order management endpoints

### 8. Authentication & Authorization
- Replace hardcoded admin credentials
- Implement proper JWT or session-based auth
- Add password hashing (bcrypt)
- Add role-based access control

### 9. Error Handling
- Add Sentry or error tracking service
- Implement proper error boundaries
- Add retry logic for failed payments
- Add email notifications for failed payments

### 10. Performance
- Add caching layer (Redis)
- Optimize images
- Implement CDN for static assets
- Add database indexes

## 📝 Development vs Production Modes

**Current (Sandbox/MVP):**
- ✅ Great for testing and development
- ✅ No actual payments processed
- ✅ Fast iteration and prototyping
- ❌ NOT secure for production use
- ❌ Can be spoofed by clients

**Production:**
- All payment verification server-side
- Database persistence
- Proper authentication
- Error tracking and monitoring
- Environment-based configuration

## 🔐 Security Best Practices
1. Never trust client-side data for payment confirmation
2. Always verify payment signatures server-side
3. Store sensitive credentials in environment variables
4. Use HTTPS in production
5. Implement rate limiting on payment endpoints
6. Log all payment transactions
7. Add fraud detection rules

## 📚 PayFast Documentation
- ITN Guide: https://developers.payfast.co.za/docs#instant_transaction_notification
- Signature Generation: https://developers.payfast.co.za/docs#signature_generation
- Sandbox Testing: https://developers.payfast.co.za/docs#sandbox_testing
