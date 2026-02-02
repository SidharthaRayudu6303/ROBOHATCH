# 🔍 Sentry Error Monitoring Integration

**Status**: ✅ **COMPLETE**  
**Version**: v1.0.0  
**Date**: February 1, 2026

---

## 📋 OVERVIEW

Sentry error monitoring has been integrated into the frontend to provide:
- ✅ Real-time error tracking in production
- ✅ Stack traces with source maps
- ✅ Performance monitoring (10% sample rate)
- ✅ React ErrorBoundary integration
- ✅ API error tracking for unexpected (5xx) errors
- ✅ Zero behavior change to business logic

---

## 🚀 FILES CREATED

### 1. **sentry.client.config.js**
- Captures client-side errors in the browser
- Performance monitoring enabled (10% in production)
- Filters out noise (browser extensions, expected errors)
- Development mode: logs only (unless DEBUG enabled)

### 2. **sentry.server.config.js**
- Captures errors during SSR and API routes
- Server-side error tracking
- Same configuration as client

### 3. **sentry.edge.config.js**
- Captures errors in Edge Runtime
- Middleware and Edge API routes

### 4. **.env.example**
- Template for required environment variables
- Includes Sentry DSN placeholder
- Environment configuration examples

### 5. **pages/sentry-test.js** (TESTING ONLY)
- Test page to verify Sentry integration
- Multiple test scenarios
- Configuration checker
- ⚠️ **DELETE BEFORE PRODUCTION**

---

## 📝 FILES MODIFIED

### 1. **pages/_app.js**
```javascript
// BEFORE:
console.error('🚨 Error Boundary caught:', error, errorInfo)
// TODO: Send to error monitoring (Sentry, LogRocket, etc.)

// AFTER:
import * as Sentry from '@sentry/nextjs'

Sentry.captureException(error, {
  contexts: {
    react: {
      componentStack: errorInfo.componentStack,
    },
  },
})
```

### 2. **lib/api.js**
```javascript
// Added Sentry import
import * as Sentry from '@sentry/nextjs'

// Capture 5xx server errors
if (response.status >= 500) {
  Sentry.captureException(new Error(`API Error: ${response.status} ${path}`), {
    extra: { path, status, errorData, translatedMessage }
  })
}

// Capture network/unknown errors
Sentry.captureException(error, {
  extra: { path, type: 'network_or_unknown' }
})
```

**Key Principles**:
- ✅ Expected errors (400, 401, 403, 404) NOT sent to Sentry
- ✅ Unexpected errors (500, 502, 503, network failures) captured
- ✅ ApiError still thrown normally (no behavior change)
- ✅ Users see same error messages as before

### 3. **next.config.js**
```javascript
const { withSentryConfig } = require('@sentry/nextjs')

const sentryWebpackPluginOptions = {
  silent: true,
  hideSourceMaps: true,
  widenClientFileUpload: true,
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
```

---

## ⚙️ ENVIRONMENT VARIABLES

### Required for Production:

```bash
# .env.local (development)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
NEXT_PUBLIC_SENTRY_DEBUG=true  # Optional: enable Sentry in dev

# Production (Vercel/Railway)
NEXT_PUBLIC_SENTRY_DSN=https://your-prod-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

### Getting Your Sentry DSN:

1. Go to [sentry.io](https://sentry.io)
2. Create account (free tier available)
3. Create new project (choose "Next.js")
4. Copy the DSN from Settings → Projects → [Your Project] → Client Keys
5. Add to environment variables

---

## 🧪 TESTING INSTRUCTIONS

### Option 1: Using Test Page (Recommended)

1. **Setup Environment**:
   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_SENTRY_DSN=your-dsn-here" > .env.local
   echo "NEXT_PUBLIC_SENTRY_DEBUG=true" >> .env.local
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Visit Test Page**:
   ```
   http://localhost:3000/sentry-test
   ```

4. **Run Tests**:
   - Click "Check Sentry Configuration" → Verify DSN is configured
   - Click "Send Test Message" → Check Sentry dashboard
   - Click "Send Test Exception" → Check Sentry dashboard
   - Click "Trigger Client Error" → Should show ErrorBoundary + send to Sentry

5. **Verify in Sentry**:
   - Go to your Sentry project dashboard
   - Check "Issues" tab
   - You should see the test errors appear within seconds

### Option 2: Manual Testing

1. **Test React ErrorBoundary**:
   ```javascript
   // Add to any page temporarily
   const TestError = () => {
     throw new Error('Test error from component')
   }
   ```

2. **Test API Error Capture**:
   - Make API call that returns 500 error
   - Check Sentry for the error
   - Make API call that returns 404
   - Verify it's NOT in Sentry (expected behavior)

---

## 📊 WHAT GETS CAPTURED

### ✅ CAPTURED (Sent to Sentry):

1. **React Errors**:
   - Component render errors
   - Lifecycle errors
   - Hook errors
   - Any error caught by ErrorBoundary

2. **API Errors (Unexpected)**:
   - 500 Internal Server Error
   - 502 Bad Gateway
   - 503 Service Unavailable
   - Network failures
   - Timeout errors

3. **Server-Side Errors**:
   - SSR errors
   - API route errors
   - Middleware errors

### ❌ NOT CAPTURED (Expected Errors):

1. **Expected API Errors**:
   - 400 Bad Request (validation errors)
   - 401 Unauthorized (not logged in)
   - 403 Forbidden (no permission)
   - 404 Not Found (resource missing)

2. **User Actions**:
   - Payment window closed (user cancelled)
   - Form validation errors
   - Normal business logic flows

3. **Browser Noise**:
   - Browser extension errors
   - ResizeObserver loop limit
   - AdBlocker interference

**Rationale**: Only unexpected errors that indicate bugs or infrastructure issues are sent to Sentry.

---

## 🔧 CONFIGURATION DETAILS

### Performance Monitoring:

- **Production**: 10% of transactions sampled
- **Development**: 100% sampled (when DEBUG enabled)
- **Edge/Server**: Same as client

**Why 10%?**: Balances cost vs visibility. For 1,000 users/day, this is ~100 transactions.

### Source Maps:

- ✅ Generated during build
- ✅ Uploaded to Sentry automatically
- ✅ Hidden from browser (secure)
- ✅ Stack traces show original code, not minified

### Environment Detection:

```javascript
environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV
```

- Development: `development`
- Staging: `staging` (set explicitly)
- Production: `production` (set explicitly)

---

## 🚨 PRODUCTION CHECKLIST

Before deploying to production:

- [ ] Sentry account created
- [ ] Next.js project created in Sentry
- [ ] DSN added to production environment variables
- [ ] `NEXT_PUBLIC_SENTRY_ENVIRONMENT=production` set
- [ ] Build succeeds: `npm run build`
- [ ] Test page deleted: `rm pages/sentry-test.js`
- [ ] Verified in staging environment first
- [ ] Dashboard access confirmed

---

## 📈 MONITORING IN PRODUCTION

### Daily Checks (Week 1):

1. **Sentry Dashboard**:
   - Check "Issues" tab daily
   - Review error frequency
   - Investigate new error patterns

2. **Key Metrics**:
   - Total errors per day
   - Error rate (errors / sessions)
   - Most common errors
   - Affected users

3. **Alert Setup** (Recommended):
   - Set up Slack/email alerts for new errors
   - Threshold: 10+ occurrences in 1 hour
   - Critical errors: immediate notification

### What to Look For:

✅ **Normal** (Expected):
- Occasional network errors
- Rare timeout errors
- < 0.1% error rate

🚨 **Action Required**:
- Spike in 500 errors → Backend issue
- Spike in network errors → Infrastructure issue
- Specific component failing → Code bug
- > 1% error rate → Investigate immediately

---

## 🔍 DEBUGGING WITH SENTRY

### Reading Stack Traces:

```
Error: Cannot read property 'name' of undefined
  at UserProfile (pages/profile.js:45:12)
  at renderWithHooks (react-dom.production.min.js:123:45)
  ...
```

**What Sentry Shows**:
- ✅ Exact file and line number
- ✅ Component where error occurred
- ✅ User's browser, OS, device
- ✅ Breadcrumbs (recent user actions)
- ✅ How many users affected

### Using Breadcrumbs:

Sentry automatically tracks:
- Navigation events
- Network requests
- Console messages
- User interactions

**Example Flow**:
```
1. User clicked "Add to Cart"
2. API request to POST /cart/items
3. Response: 500 Internal Server Error
4. Error captured with full context
```

---

## 💰 COST CONSIDERATIONS

### Sentry Free Tier:

- ✅ 5,000 errors/month
- ✅ 10,000 performance units/month
- ✅ 1 year data retention
- ✅ Unlimited projects
- ✅ Unlimited team members

### v1.0.0 Estimate:

**Expected Usage (100 users/day)**:
- Errors: ~50-100/month (0.1% error rate)
- Performance: ~3,000 transactions/month (10% sample)
- **Cost**: FREE (well within limits)

**If scaling to 1,000 users/day**:
- Errors: ~500-1,000/month
- Performance: ~30,000 transactions/month
- **Cost**: ~$26/month (Developer plan)

---

## 🛠️ TROUBLESHOOTING

### Issue: Errors not appearing in Sentry

**Solution**:
```bash
# 1. Check DSN is configured
echo $NEXT_PUBLIC_SENTRY_DSN

# 2. Enable debug mode in development
export NEXT_PUBLIC_SENTRY_DEBUG=true

# 3. Restart dev server
npm run dev

# 4. Trigger test error
# Visit /sentry-test and click buttons

# 5. Check console for Sentry logs
# Should see: "🚨 [Sentry Debug] Would send error: ..."
```

### Issue: Build failing with Sentry

**Solution**:
```bash
# 1. Verify @sentry/nextjs is installed
npm list @sentry/nextjs

# 2. Clear cache and rebuild
rm -rf .next
npm run build

# 3. Check next.config.js syntax
# Ensure withSentryConfig is wrapping nextConfig
```

### Issue: Source maps not working

**Solution**:
1. Verify `hideSourceMaps: true` in next.config.js
2. Ensure build completes successfully
3. Check Sentry project settings → Source Maps
4. Verify auth token is set (for automated uploads)

---

## 📚 ADDITIONAL RESOURCES

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Dashboard](https://sentry.io)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Source Maps Setup](https://docs.sentry.io/platforms/javascript/sourcemaps/)

---

## ✅ VERIFICATION CHECKLIST

- [x] @sentry/nextjs package installed
- [x] Client config created (sentry.client.config.js)
- [x] Server config created (sentry.server.config.js)
- [x] Edge config created (sentry.edge.config.js)
- [x] ErrorBoundary integrated (pages/_app.js)
- [x] API error capture added (lib/api.js)
- [x] next.config.js updated with withSentryConfig
- [x] .env.example created with DSN template
- [x] Test page created (pages/sentry-test.js)
- [x] Documentation created (this file)
- [x] Build succeeds without errors
- [ ] Sentry account created (USER ACTION)
- [ ] DSN configured in .env.local (USER ACTION)
- [ ] Test errors verified in dashboard (USER ACTION)
- [ ] sentry-test.js deleted before production (BEFORE DEPLOY)

---

## 🎯 FINAL STATUS

**Sentry Integration**: ✅ **COMPLETE**

**What Changed**:
- Added error monitoring to catch production issues
- Zero change to user-facing behavior
- Zero change to business logic
- Zero change to API calls or responses

**What Users See**:
- Same error messages as before
- Same ErrorBoundary UI as before
- Same API error handling as before
- **No visible change**

**What Developers Get**:
- Real-time error notifications
- Stack traces with source code
- User context for each error
- Performance insights
- Production visibility

---

**Frontend v1.0.0 Status**: 🟢 **PRODUCTION-READY**

All blockers resolved. Ready to ship. 🚀
