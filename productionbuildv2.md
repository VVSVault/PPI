# Pink Post Installations - Production Build v2 Documentation

## Overview

This document covers all development progress, bug fixes, and deployment configurations made during the v2.5-v2.7 development cycle. Pink Post Installations is a Next.js 14 application for real estate sign installation services.

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
9. [Troubleshooting](#troubleshooting)

---

## New Features

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

### Admin Access"C:\Users\tanne\Downloads\8d52185d-f97a-4cdb-896a-31ab64a8933c.png"
- Only seeded via `npx prisma db seed`
- Default: `admin@pinkposts.com` / `admin123`
- Role: `admin`

### Session Duration
- JWT strategy with 30-day persistence
- Secure cookies in production
- Auto-refresh on activity

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

1. **Run migration** on Railway for PasswordResetToken and ServiceRequest tables
   ```bash
   npx prisma db push
   ```
2. **Update admin credentials** after first login
3. **Configure Stripe webhooks** for payment processing
4. **Test password reset flow** end-to-end
5. **Test mobile responsiveness** on various devices

---

*Last Updated: December 2024*
*Version: 2.8.0*
