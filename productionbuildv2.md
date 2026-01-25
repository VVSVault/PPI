# Pink Post Installations - Production Build v2 Documentation

## Overview

This document covers all development progress, bug fixes, and deployment configurations made during the v2.5-v2.9 development cycle. Pink Post Installations is a Next.js 14 application for real estate sign installation services.

**Repository:** https://github.com/VVSVault/PPI
**Hosting:** Railway
**Database:** Railway PostgreSQL with Prisma ORM

---

## Table of Contents

1. [New Features](#new-features)
2. [Bug Fixes](#bug-fixes)
3. [Deployment Configuration](#deployment-configuration)
4. [Environment Variables](#environment-variables)
5. [Database Migrations](#database-migrations)
6. [API Endpoints](#api-endpoints)
7. [Component Updates](#component-updates)
8. [Authentication](#authentication)
9. [Known Gaps & Required Fixes](#known-gaps--required-fixes)
10. [Troubleshooting](#troubleshooting)

---

## New Features

### v2.9.2 - Critical Fixes & UI Refresh

#### Critical Gap Fixes
All 4 critical issues identified in v2.9.1 have been resolved:

1. **Order History Page** (`app/dashboard/order-history/page.tsx`)
   - Replaced mock data with real API calls to `/api/orders`
   - Added loading and error states
   - Implemented pagination support

2. **Order Details Page** (`app/dashboard/orders/[id]/page.tsx`) - NEW
   - Created customer-facing order details page
   - Visual status timeline showing order progress
   - Full order details with items, pricing, and payment status
   - Fixes broken notification links

3. **Installation Item Creation** (`app/api/orders/[id]/route.ts`)
   - When orders complete, now creates `InstallationRider` records
   - Creates `InstallationLockbox` records from order items
   - Updates customer inventory status (inStorage → false)

4. **Customer Service Requests** - NEW
   - API: `app/api/service-requests/route.ts`
   - Page: `app/dashboard/service-requests/page.tsx`
   - Summary cards with status counts
   - Filterable tabs (All, Active, Completed)
   - Added to sidebar navigation with Wrench icon

#### UI Updates - Logo & Sidebar Redesign

**New Logo:**
- Updated to pink bird mascot SVG logo
- Files: `public/images/logo.svg`, `app/icon.svg` (favicon)
- Automatically used in navbar, sidebar, and favicon

**Dashboard Sidebar Color Change:**
- Background: `bg-pink-600` → `bg-pink-50` (light pink)
- Text: `text-pink-100` → `text-gray-700` (dark text)
- Borders: `border-pink-500/30` → `border-pink-200`
- Active state: Remains `bg-pink-500 text-white`
- Hover state: `hover:bg-pink-200 hover:text-pink-900`
- Logo variant: `light` → `dark` for visibility

**Files Modified:**
- `components/shared/logo.tsx` - Updated to use SVG
- `components/dashboard/sidebar.tsx` - Light pink theme

---

### v2.9.1 - Security Hardening

#### Route Protection Middleware
New `middleware.ts` at project root for edge-level route protection:

```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    // Admin routes require admin role
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protected routes require authentication
        if (path.startsWith('/dashboard') || path.startsWith('/api/orders')) {
          return !!token
        }
        return true
      },
    },
  }
)
```

**Protected Routes:**
- `/dashboard/*` - Requires authentication
- `/admin/*` - Requires admin role
- API routes: orders, profile, inventory, notifications, payments, service-requests

#### Rate Limiting
New `lib/rate-limit.ts` utility for protecting auth endpoints:

```typescript
// Rate limit presets
export const rateLimitPresets = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },      // 5 per 15 min
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 },    // 100 per 15 min
}
```

**Features:**
- In-memory rate limiting (single-instance deployments)
- Returns 429 with `Retry-After` header
- Automatic cleanup of expired entries

#### Account Lockout
Protects against brute force attacks:

```typescript
// After 5 failed login attempts
if (failedAttempts >= 5) {
  lockoutUntil = now + 15 * 60 * 1000 // 15 minute lockout
}
```

**Integration in `lib/auth.ts`:**
- Tracks failed attempts per email
- Locks account after 5 failures
- Shows remaining lockout time in error message
- Clears on successful login

#### Password Strength Validation
Registration endpoint now validates passwords:

```typescript
// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = {
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
}
```

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

### v2.9.0 - Client Spec Updates & Notifications

#### Notification System
Complete in-app notification system for users:

**New Database Model:**
```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String           @map("user_id")
  type      NotificationType
  title     String
  message   String
  link      String?
  isRead    Boolean          @default(false) @map("is_read")
  createdAt DateTime         @default(now()) @map("created_at")
  user      User             @relation(...)
}

enum NotificationType {
  order_confirmed, order_scheduled, order_in_progress, order_completed,
  order_cancelled, service_request_acknowledged, service_request_scheduled,
  service_request_completed, removal_reminder, welcome
}
```

**New Components:**
- `NotificationDropdown` - Bell icon dropdown in dashboard header
- Auto-polls every 30 seconds for new notifications
- Mark as read (individual or all)
- Icon per notification type

**New API Endpoints:**
- `GET /api/notifications` - Fetch notifications with unread count
- `PUT /api/notifications` - Mark notifications as read

**Notification Triggers:**
- Order status changes (confirmed, scheduled, completed, cancelled)
- Service request updates (acknowledged, scheduled, completed)
- New user registration (welcome message)

#### Order Form Questions
New required fields per client specification:

1. **Gated Community**
   - Yes/No toggle
   - Gate code field (required if Yes)

2. **Marker Placement**
   - "Did you leave a marker where you want the post placed?"
   - Yes/No toggle

3. **Sign Orientation**
   - Perpendicular (faces street directly)
   - Parallel (runs along street)
   - Corner Angle (angled toward intersection)
   - Let Installer Decide
   - Other (with text field)

#### Pricing Updates
Updated per client specification:

| Item | Old Price | New Price |
|------|-----------|-----------|
| Expedite Fee | $25 | $50 |
| Lockbox Rental | $15 | $10 |
| Brochure Box Install | $2 | $3 |
| Brochure Box Rental | N/A | $5 (new option) |

#### Dashboard Real Data
- New users see empty state with CTA instead of mock data
- Stats calculated from actual orders and installations
- Fetches real data from `/api/dashboard/stats`

#### Logo Navigation
Context-aware logo links:
- On dashboard/admin pages → links to `/dashboard`
- On marketing pages → links to `/` (home)

#### Removed Features
- Replacement charges removed from Post Options cards
- "Buy new" brochure box option replaced with rental

---

### v2.8.0 - Password Reset & Mobile UX

#### Forgot Password Flow
Complete password reset functionality with Resend email integration:

**New Database Model:**
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expires   DateTime
  createdAt DateTime @default(now()) @map("created_at")

  @@map("password_reset_tokens")
}
```

**New Pages:**
- `/forgot-password` - Email entry form
- `/reset-password?token=xxx` - New password form

**New API Endpoints:**
- `POST /api/auth/forgot-password` - Request reset email
- `POST /api/auth/reset-password` - Reset password with token

**Features:**
- Secure token generation (32-byte hex)
- 1-hour token expiration
- Prevents email enumeration (same response for valid/invalid emails)
- Styled email template matching brand

#### Mobile Dashboard Improvements
Comprehensive mobile responsiveness fixes:

**Header Component:**
- Added padding to clear hamburger menu button
- Responsive text sizes and gaps
- Shortened button labels on mobile ("+ Order")

**Dashboard Page:**
- Responsive padding (`p-4 lg:p-6`)
- Stacked layout for section headers on mobile
- Full-width search input on small screens

**Active Installations:**
- Mobile card view (replaces table on screens < 768px)
- Cards show: address, city/state, date, MLS#, status badge
- Dropdown menu preserved on cards
- Table hidden on mobile, shown on desktop

**Order Wizard Step Indicator:**
- Mobile: Simple progress bar with "Step X of 8"
- Shows current step title
- Animated fill progress
- Desktop: Original circle indicators unchanged

#### Business Logic Updates

**Removed Sold Rider:**
- Removed from marketing riders page
- Removed from dashboard rider options
- Removed from RiderSelector checkout flow
- Replaced with "Open House" in Popular category

**Updated Reinstallation Fee:**
- Changed from $35 to FREE
- Added disclaimer: "*FREE if caused by weather or other natural causes"
- Green color highlight for FREE text

#### Branding Updates

**New Logo Mascot:**
- Replaced CSS-styled logo with pink bird mascot image
- Bird holding sign post with "Pp" branding
- Image stored at `/public/images/logo.png`
- Logo component updated to use Next.js Image

**Logo Component (`components/shared/logo.tsx`):**
- Uses Next.js Image component for optimization
- Responsive sizes: sm (32x32), md (40x40), lg (56x56)
- Supports light/dark text variants
- Text displays "Pink" + "Post" (pink colored)

**Marketing Header:**
- Increased navbar height to `h-20` (was `h-16`)
- Logo size increased to `lg` variant (56x56)

---

### v2.7.0 - Service Requests & Installation Actions

#### ServiceRequest Model
New database model for tracking service/removal requests from customers:

```prisma
model ServiceRequest {
  id              String              @id @default(cuid())
  installationId  String              @map("installation_id")
  userId          String              @map("user_id")
  type            ServiceRequestType
  status          ServiceRequestStatus @default(pending)
  description     String?
  requestedDate   DateTime?           @map("requested_date")
  notes           String?
  adminNotes      String?             @map("admin_notes")
  completedAt     DateTime?           @map("completed_at")
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  installation    Installation        @relation(...)
  user            User                @relation(...)
}

enum ServiceRequestType { removal, service, repair, replacement }
enum ServiceRequestStatus { pending, acknowledged, scheduled, in_progress, completed, cancelled }
```

#### Installation Dropdown Actions
Three new modals accessible from the active installations table:

1. **View Details Modal** (`InstallationDetailsModal.tsx`)
   - Shows installation address, dates, status
   - Lists attached riders and lockboxes
   - Displays service request history

2. **Schedule Removal Modal** (`ScheduleRemovalModal.tsx`)
   - Date picker for preferred removal date
   - Notes field for special instructions
   - Creates removal-type service request
   - Auto-updates installation status to `removal_scheduled`

3. **Request Service Modal** (`RequestServiceModal.tsx`)
   - Service type selection (General Service, Repair, Replacement)
   - Description field
   - Preferred date picker
   - Creates service request for admin review

#### Admin Service Requests Page
New admin page at `/admin/service-requests`:

- Status cards with counts (Pending, Acknowledged, Scheduled, In Progress, Completed)
- Clickable filters by status and request type
- Detail modal with actions:
  - Acknowledge request
  - Schedule date
  - Mark complete
  - Cancel request
  - Add admin notes
- Auto-updates installation status when removal completed

#### Replacement Fee Policy Update
- Removed replacement fee mentions from all public-facing pages
- Added disclosure to order review step:
  - "Rental items remain property of Pink Post Installations"
  - "Lost, damaged, or unreturned rental items are subject to replacement fees"
  - "Replacement fees will be charged to your payment method on file"

### v2.6.0 - Spec Verification & Fixes

#### Installation Location Image Attachment
- Paperclip button on installation location field
- Image preview with remove option
- Max 5MB, validates image file type
- Stored as base64 in database

#### Order Confirmation Page
New page at `/dashboard/order-confirmation`:
- Shows order details after successful payment
- Displays items, totals, and payment status
- "What's Next" section explaining installation process
- Links to order history and place another order

#### Profile API
- `GET /api/profile` - Fetch user profile
- `PUT /api/profile` - Update profile fields
- Real data persistence on profile page

#### Lockbox Options Updates
- SentriLock: $5 install (customer-owned only)
- Mechanical (Owned): $5 install
- Mechanical (Rental): $15 per order
- Clarified "per order, not monthly" in terms

#### Removed Features
- Deleted invoices page (payment at order time per spec)
- Deleted `invoice-table.tsx` component

### v2.5.0 - Admin Dashboard Enhancements

#### Global Inventory Overview
New admin page at `/admin/inventory`:
- Summary cards (total signs, riders, lockboxes, brochure boxes)
- Filter by item type
- Search by description or customer name
- Links to customer detail pages

#### Email Configuration API
- `GET /api/admin/settings/email` - Returns Resend API status
- `POST /api/admin/settings/email` - Send test email
- Live status display on admin settings page

#### Admin Sidebar Updates
- Color-aware branding ("Pink" white, "Post" pink, "Admin" gray)
- Service Requests nav item with Wrench icon

---

## Bug Fixes

### NextAuth Configuration
**Issue:** 500 errors on `/api/auth/session`

**Cause:** PrismaAdapter was causing issues with schema relations to non-existent tables

**Fix:** Removed PrismaAdapter (not needed for JWT strategy with credentials provider)

```typescript
// lib/auth.ts - Before
adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],

// lib/auth.ts - After
// Adapter removed - not needed for JWT + credentials
```

### Session Persistence
**Issue:** Users had to re-login on every visit

**Fix:** Added session maxAge and cookie configuration:

```typescript
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
},
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  },
},
```

### ServiceRequest Table Missing
**Issue:** API errors when ServiceRequest table doesn't exist

**Fix:** Added try-catch blocks around all ServiceRequest queries:

```typescript
// Example from /api/admin/stats
let pendingServiceRequests = 0
try {
  pendingServiceRequests = await prisma.serviceRequest.count({
    where: { status: { in: ['pending', 'acknowledged'] } },
  })
} catch {
  // Table may not exist yet if migration hasn't run
  pendingServiceRequests = 0
}
```

### Order Confirmation Suspense
**Issue:** Build error - `useSearchParams()` needs Suspense boundary

**Fix:** Wrapped content in Suspense:

```tsx
export default function OrderConfirmationPage() {
  return (
    <div>
      <Header title="Order Confirmation" />
      <Suspense fallback={<LoadingFallback />}>
        <OrderConfirmationContent />
      </Suspense>
    </div>
  )
}
```

### Select Component Pattern
**Issue:** Runtime error "Cannot read properties of undefined (reading 'map')"

**Fix:** Use `options` prop instead of children:

```tsx
// Wrong
<Select>
  <option value="a">A</option>
</Select>

// Correct
<Select options={[{ value: 'a', label: 'A' }]} />
```

---

## Deployment Configuration

### Railway Setup

#### Start Command
```json
// package.json
"start": "next start -p $PORT -H 0.0.0.0"
```

#### Prisma Seed Configuration
```typescript
// prisma.config.ts
export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
})
```

#### Seed Script Environment Handling
```typescript
// prisma/seed.ts
// Only load from .env files if DATABASE_URL is not already set
if (!process.env.DATABASE_URL) {
  config({ path: '.env.local' })
  config({ path: '.env' })
}
```

---

## Environment Variables

### Required for Railway

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | JWT signing secret | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `https://your-app.up.railway.app` |
| `STRIPE_SECRET_KEY` | Stripe API key | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `RESEND_API_KEY` | Email API key | `re_...` |
| `ADMIN_EMAIL` | Admin notification email | `contact@pinkposts.com` |

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## Database Migrations

### Pending Migrations

#### ServiceRequest Table
```bash
npx prisma migrate deploy
# or
npx prisma db push
```

### Run Seed
```bash
npx prisma db seed
```

Creates:
- 3 post types (White, Black, Pink)
- 26 rider types
- 3 lockbox types
- Admin user (`admin@pinkposts.com` / `admin123`)

---

## API Endpoints

### Service Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/installations/[id]` | Get installation details with service history |
| POST | `/api/installations/[id]/service-request` | Create service/removal request |
| GET | `/api/admin/service-requests` | List all requests with counts (admin) |
| GET | `/api/admin/service-requests/[id]` | Get request details (admin) |
| PUT | `/api/admin/service-requests/[id]` | Update request status (admin) |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/forgot-password` | Request password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update user profile |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/inventory` | Global inventory overview |
| GET | `/api/admin/settings/email` | Email configuration status |
| POST | `/api/admin/settings/email` | Send test email |

---

## Component Updates

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `InstallationDetailsModal` | `components/dashboard/installation-modals/` | View installation details |
| `ScheduleRemovalModal` | `components/dashboard/installation-modals/` | Schedule sign removal |
| `RequestServiceModal` | `components/dashboard/installation-modals/` | Request service/repair |
| `RiderSelector` | `components/order-flow/RiderSelector/` | Categorized rider selection |
| `RiderCallout` | `components/marketing/` | Landing page rider showcase |

### Modified Components

| Component | Changes |
|-----------|---------|
| `active-posts-table.tsx` | Added dropdown handlers and modals |
| `review-step.tsx` | Added replacement fee disclosure |
| `property-step.tsx` | Added image attachment feature |

---

## Authentication

### User Registration
- Users self-register at `/sign-up`
- Automatically assigned `customer` role
- API: `POST /api/auth/register`
- **Password requirements:** 8+ chars, uppercase, lowercase, number
- **Rate limited:** 5 attempts per 15 minutes

### Admin Access
- Only seeded via `npx prisma db seed`
- Default: `admin@pinkposts.com` / `admin123`
- Role: `admin`

### Session Duration
- JWT strategy with 30-day persistence
- Secure cookies in production
- Auto-refresh on activity

### Security Features (v2.9.1)
- **Route Protection:** Middleware protects `/dashboard/*` and `/admin/*`
- **Rate Limiting:** Auth endpoints limited to 5 requests per 15 minutes
- **Account Lockout:** 5 failed logins = 15 minute lockout
- **Password Validation:** Minimum 8 chars with complexity requirements
- **Secure Cookies:** HttpOnly, SameSite=Lax, Secure in production

---

## Known Gaps & Required Fixes

### Critical Issues - RESOLVED ✅

All 4 critical issues identified in v2.9.1 have been fixed:

#### ✅ 1. Order History Page - FIXED
**File:** `app/dashboard/order-history/page.tsx`

**Resolution:** Page now fetches real orders from `/api/orders` endpoint with:
- Loading and error states
- Pagination support
- Transformation of API data to table format

---

#### ✅ 2. Customer Order Details Page - FIXED
**File:** `app/dashboard/orders/[id]/page.tsx`

**Resolution:** Created new page with:
- Order status with visual timeline
- Full order details (address, post type, schedule)
- Order items breakdown with pricing
- Payment status display
- Links to related actions

---

#### ✅ 3. Installation Items on Order Completion - FIXED
**File:** `app/api/orders/[id]/route.ts`

**Resolution:** When order status changes to `completed`, the system now:
- Creates `InstallationRider` records for rider items
- Creates `InstallationLockbox` records for lockbox items
- Updates customer inventory status (inStorage → false)
- Handles both customer-owned and rental items

---

#### ✅ 4. Customer Service Requests Page - FIXED
**Files:**
- `app/api/service-requests/route.ts` (new)
- `app/dashboard/service-requests/page.tsx` (new)

**Resolution:** Created customer service requests system with:
- API endpoint for customers to fetch their requests
- Dedicated page with status summary cards
- Filterable tabs (All, Active, Completed)
- Request details with admin notes

---

### Medium Priority - Should Fix

| Issue | Description | Impact |
|-------|-------------|--------|
| **No Order Status Validation** | Orders can transition to any status (e.g., completed → pending) | Admin could accidentally revert completed orders |
| **Payment Failure Not Handled** | Stripe webhook handles `payment_intent.succeeded` but not `payment_intent.failed` | Customers not notified of failed payments |
| **No Admin Scheduling UI** | Orders have `scheduledDate` field but no UI to set it after creation | Admin can't record when installation is scheduled |
| **Expedited Orders Not Highlighted** | Admin can't easily identify expedited orders in the list | Expedited orders may be missed |
| **No Customer Cancel for Service Requests** | Customers can't cancel their own pending service requests | Poor UX for customers who change their minds |

---

### API Endpoints Status

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/orders` | ✅ Working | Used by Order History page |
| `GET /api/orders/[id]` | ✅ Working | Used by Order Details page |
| `GET /api/service-requests` | ✅ Working | Customer service requests endpoint |
| `/dashboard/orders/[id]` | ✅ Working | Order details page for customers |
| `/dashboard/service-requests` | ✅ Working | Service requests page for customers |

---

## Troubleshooting

### Bad Gateway on Railway
1. Check `PORT` environment variable is set
2. Verify start command: `next start -p $PORT -H 0.0.0.0`
3. Check deploy logs for errors

### NextAuth Errors
1. Verify `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` matches your domain
3. Check for missing database tables

### Database Connection Issues
1. Verify `DATABASE_URL` format
2. Check Railway PostgreSQL service is running
3. Run `npx prisma db push` to sync schema

### Sign-in Not Working
1. Run seed: `npx prisma db seed`
2. Check password hash (bcrypt 12 rounds)
3. Verify user exists in database

---

## Commit History (Recent)

| Commit | Description |
|--------|-------------|
| `0ca2c48` | v2.9.1: Security hardening - middleware, rate limiting, password validation |
| `883780a` | v2.9.0: Notification system and client spec updates |
| `12f8bf2` | Update productionbuildv2.md with logo changes |
| `65f2ad0` | Increase logo size in marketing header |
| `923f62a` | Replace CSS logo with pink bird mascot image |
| `9ba406e` | Update productionbuildv2.md for v2.8.0 |
| `cbf8e7b` | Remove Sold rider and update reinstallation fee |
| `74ee9bd` | Fix order wizard step indicator for mobile |
| `75648c3` | Add forgot password feature and mobile dashboard improvements |
| `3f0ae7c` | Add productionbuildv2.md documentation |
| `8f5c51a` | Add session persistence with 30-day cookie duration |
| `b0b548d` | Fix start command for Railway deployment |
| `dc9061d` | Fix seed script to work with Railway environment variables |
| `fa9bd24` | Add seed command to Prisma config |
| `a0de92b` | Fix seed to always update admin password |
| `0db0838` | Add explicit secret config to NextAuth |
| `de08aba` | Fix NextAuth by removing unnecessary PrismaAdapter |
| `ba8ee7e` | Handle missing ServiceRequest table gracefully |
| `c8e64f3` | Fix order-confirmation page build error |
| `3a910b2` | Add service requests, installation actions, and admin enhancements |

---

## Next Steps

### Critical Fixes - COMPLETED ✅
1. ~~**Wire up Order History page**~~ - ✅ Done
2. ~~**Create Order Details page**~~ - ✅ Done
3. ~~**Fix Installation item creation**~~ - ✅ Done
4. ~~**Create Service Requests page**~~ - ✅ Done

### Configuration Tasks
5. **Update admin credentials** after first login
6. **Configure Stripe webhooks** for payment processing
7. **Test password reset flow** end-to-end

### Testing
8. **Test mobile responsiveness** on various devices
9. **Security testing** - Verify rate limiting and account lockout work as expected
10. **End-to-end order flow testing** - Place order → admin updates → customer notifications

### Medium Priority Fixes (Post-Launch)
11. Add order status validation to prevent invalid transitions
12. Handle `payment_intent.failed` webhook event
13. Add admin UI for scheduling orders
14. Highlight expedited orders in admin list
15. Allow customers to cancel pending service requests

---

*Last Updated: January 2025*
*Version: 2.9.2*
