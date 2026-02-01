# Payment Flow Guide - Razorpay Payment Link Integration

## Overview

This guide explains the complete payment flow using Razorpay payment links.

## Flow Diagram

```
┌─────────────┐
│   User      │
│  Creates    │
│   Order     │
└──────┬──────┘
       │
       │ POST /api/v1/orders (with Idempotency-Key)
       ↓
┌─────────────────────────────────────┐
│  Backend                            │
│  - Creates order                    │
│  - Clears cart                      │
│  - Returns orderId                  │
└──────┬──────────────────────────────┘
       │
       │ orderId: "ORD-2026-001234"
       ↓
┌─────────────────────────────────────┐
│  Frontend                           │
│  - Calls initiatePayment(orderId)   │
└──────┬──────────────────────────────┘
       │
       │ POST /api/v1/payments/initiate
       │ Body: { orderId: "ORD-2026-001234" }
       ↓
┌─────────────────────────────────────────────────────────┐
│  Backend                                                │
│  - Calculates order total (from database)               │
│  - Generates Razorpay payment link:                     │
│    https://razorpay.me/@sivaramakrishnarankiredd        │
│      ?amount=172584                                     │
│      &purpose=Order-ORD-2026-001234                     │
│  - Creates payment record (status: pending)             │
│  - Returns { paymentUrl, paymentId }                    │
└──────┬──────────────────────────────────────────────────┘
       │
       │ { paymentUrl: "https://razorpay.me/...", paymentId: "pay_xyz" }
       ↓
┌─────────────────────────────────────┐
│  Frontend                           │
│  - window.location.href = paymentUrl│
└──────┬──────────────────────────────┘
       │
       │ Redirect
       ↓
┌─────────────────────────────────────┐
│  Razorpay Payment Page              │
│  - User enters payment details      │
│  - User completes payment           │
└──────┬──────────────────────────────┘
       │
       │ Payment Success
       ↓
┌─────────────────────────────────────┐
│  Razorpay Webhook                   │
│  → POST /api/v1/payments/webhook    │
└──────┬──────────────────────────────┘
       │
       │ Webhook payload with payment status
       ↓
┌───────────────────────────────────────────────────┐
│  Backend                                          │
│  - Verifies webhook signature                     │
│  - Updates payment record (status: completed)     │
│  - Updates order (paymentStatus: paid)            │
│  - Sends confirmation email                       │
└──────┬────────────────────────────────────────────┘
       │
       │ User redirected back to site
       ↓
┌─────────────────────────────────────┐
│  Frontend Success Page              │
│  - GET /api/v1/payments/:orderId    │
│  - Shows payment success            │
│  - Displays order details           │
└─────────────────────────────────────┘
```

## Frontend Implementation

### 1. lib/api.js

```javascript
/**
 * Initiate payment for an order
 * POST /api/v1/payments/initiate
 */
export async function initiatePayment(orderId) {
  const response = await apiFetch('/api/v1/payments/initiate', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
  return await response.json();
}

/**
 * Get payment status for an order
 * GET /api/v1/payments/:orderId
 */
export async function getPaymentStatus(orderId) {
  const response = await apiFetch(`/api/v1/payments/${orderId}`);
  return await response.json();
}
```

### 2. Checkout Flow (components/CheckoutExample.js)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    // STEP 1: Create Order
    const result = await createOrder(orderData);
    
    // STEP 2: Initiate Payment
    const paymentResult = await initiatePayment(result.orderId);
    
    // STEP 3: Redirect to Payment
    window.location.href = paymentResult.paymentUrl;
    
  } catch (err) {
    setError(err.message);
    setIsProcessing(false);
  }
};
```

### 3. Payment Status Check (components/PaymentExample.js)

```javascript
useEffect(() => {
  if (orderId) {
    checkPaymentStatus();
  }
}, [orderId]);

const checkPaymentStatus = async () => {
  const status = await getPaymentStatus(orderId);
  setPaymentStatus(status);
};
```

## Backend Implementation Required

### 1. POST /api/v1/payments/initiate

**Request:**
```json
{
  "orderId": "ORD-2026-001234"
}
```

**Process:**
1. Validate order exists and belongs to user
2. Calculate total from order_items table
3. Generate Razorpay payment link:
   ```javascript
   const baseUrl = process.env.RAZORPAY_PAYMENT_LINK;
   // https://razorpay.me/@sivaramakrishnarankiredd
   
   const amountInPaise = Math.round(orderTotal * 100);
   const purpose = `Order-${orderId}`;
   
   const paymentUrl = `${baseUrl}?amount=${amountInPaise}&purpose=${encodeURIComponent(purpose)}`;
   ```
4. Create payment record:
   ```sql
   INSERT INTO payments (order_id, amount, status, payment_url, created_at)
   VALUES (?, ?, 'pending', ?, NOW())
   ```
5. Return payment URL

**Response:**
```json
{
  "paymentUrl": "https://razorpay.me/@sivaramakrishnarankiredd?amount=172584&purpose=Order-ORD-2026-001234",
  "paymentId": "pay_abc123xyz"
}
```

### 2. GET /api/v1/payments/:orderId

**Response:**
```json
{
  "status": "completed",
  "paymentId": "pay_abc123xyz",
  "amount": 1725.84,
  "paidAt": "2026-02-01T11:15:00Z"
}
```

**Status Values:**
- `pending` - Payment initiated, awaiting completion
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### 3. POST /api/v1/payments/webhook (Razorpay Webhook)

**Setup:**
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://robohatch-backend-production.up.railway.app/api/v1/payments/webhook`
3. Enable events: `payment.captured`, `payment.failed`

**Process:**
```javascript
router.post('/api/v1/payments/webhook', async (req, res) => {
  // 1. Verify webhook signature
  const signature = req.headers['x-razorpay-signature'];
  const isValid = verifyRazorpaySignature(req.body, signature);
  
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  // 2. Parse event
  const event = req.body.event;
  const paymentData = req.body.payload.payment.entity;
  
  // 3. Update payment status
  if (event === 'payment.captured') {
    await db.query(
      'UPDATE payments SET status = ?, razorpay_payment_id = ?, paid_at = NOW() WHERE payment_id = ?',
      ['completed', paymentData.id, paymentData.notes.paymentId]
    );
    
    await db.query(
      'UPDATE orders SET payment_status = ? WHERE order_id = ?',
      ['paid', paymentData.notes.orderId]
    );
    
    // Send confirmation email
    await sendOrderConfirmationEmail(paymentData.notes.orderId);
  }
  
  res.json({ success: true });
});
```

## Database Schema

### payments table

```sql
CREATE TABLE payments (
  payment_id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_url TEXT,
  razorpay_payment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### orders table update

```sql
ALTER TABLE orders 
ADD COLUMN payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending';
```

## Environment Variables

### Backend (.env)
```env
RAZORPAY_PAYMENT_LINK=https://razorpay.me/@sivaramakrishnarankiredd
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard
```

### Frontend (.env.local)
```env
RAZORPAY_PAYMENT_LINK=https://razorpay.me/@sivaramakrishnarankiredd
```

## Payment Link Format

**Base URL:** `https://razorpay.me/@sivaramakrishnarankiredd`

**Query Parameters:**
- `amount` - Amount in **paise** (₹1725.84 → 172584)
- `purpose` - Payment description (e.g., "Order-ORD-2026-001234")

**Example:**
```
https://razorpay.me/@sivaramakrishnarankiredd?amount=172584&purpose=Order-ORD-2026-001234
```

**Amount Conversion:**
```javascript
// Frontend sends order total in rupees: 1725.84
// Backend converts to paise: 172584
const amountInPaise = Math.round(orderTotal * 100);
```

## Testing Flow

1. **Create Test Order:**
   ```bash
   POST /api/v1/orders
   # Returns: { orderId: "ORD-2026-001234" }
   ```

2. **Initiate Payment:**
   ```bash
   POST /api/v1/payments/initiate
   Body: { "orderId": "ORD-2026-001234" }
   # Returns: { paymentUrl: "https://razorpay.me/..." }
   ```

3. **Manual Testing:**
   - Open payment URL in browser
   - Complete test payment
   - Verify webhook called
   - Check order status updated

4. **Status Check:**
   ```bash
   GET /api/v1/payments/ORD-2026-001234
   # Returns: { status: "completed", ... }
   ```

## Error Handling

### Payment Initiation Failed
```javascript
try {
  const result = await initiatePayment(orderId);
  window.location.href = result.paymentUrl;
} catch (err) {
  // Show error to user
  setError('Failed to initiate payment. Please try again.');
}
```

### Payment Failed on Razorpay
- Razorpay sends `payment.failed` webhook event
- Backend updates payment status to `failed`
- User can retry payment from order details page

### Webhook Failed
- Backend should have retry mechanism
- Log webhook failures for manual intervention
- Send alert if payment completed but webhook not processed

## Security Considerations

1. **Always verify webhook signature** - Prevents fake payment notifications
2. **Store amounts in backend** - Never trust frontend calculations
3. **Use HTTPS only** - All payment URLs must be secure
4. **Idempotency** - Order creation uses idempotency keys
5. **User authentication** - Verify user owns the order before payment

## Success Criteria

✅ User creates order → gets orderId  
✅ Frontend initiates payment → gets Razorpay URL  
✅ User redirected to Razorpay payment page  
✅ User completes payment  
✅ Webhook updates backend  
✅ Order status changes to "paid"  
✅ User sees success message  
✅ Cart is cleared  

## Next Steps

1. Implement backend endpoints (POST /payments/initiate, GET /payments/:orderId)
2. Set up Razorpay webhook handler
3. Create payments table in database
4. Test end-to-end flow
5. Add email notifications
6. Implement payment retry logic
7. Add refund functionality (if needed)
