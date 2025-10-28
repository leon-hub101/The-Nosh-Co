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
   - Implement endpoint: `POST /api/payfast/notify`
   - Verify PayFast signature
   - Validate payment amount and merchant ID
   - Update order status in database only after verification
   - Log all payment notifications

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
# Server-side only
PAYFAST_MERCHANT_ID=your_production_id
PAYFAST_MERCHANT_KEY=your_production_key
PAYFAST_PASSPHRASE=your_passphrase

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

### 4. Real Push Notifications
- Integrate Firebase Cloud Messaging (Unit 5)
- Replace mock push hook with FCM SDK
- Store FCM tokens in database
- Implement server-side notification sending

### 5. Product Management
- Replace hardcoded products with database
- Add product images to cloud storage
- Implement admin API for product CRUD
- Add inventory management

### 6. Authentication & Authorization
- Replace hardcoded admin credentials
- Implement proper JWT or session-based auth
- Add password hashing (bcrypt)
- Add role-based access control

### 7. Error Handling
- Add Sentry or error tracking service
- Implement proper error boundaries
- Add retry logic for failed payments
- Add email notifications for failed payments

### 8. Performance
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
