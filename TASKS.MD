# Warehouse Profit Analytics - Task Breakdown

## Phase A: PWA Skeleton + Authentication ✅
**Goal**: Basic React PWA with Google OAuth authentication

### A1. Project Setup ✅
- [x] Initialize React project with Vite
- [x] Configure Tailwind CSS
- [x] Set up PWA configuration (manifest.json, service worker)
- [x] Configure TypeScript
- [x] Set up ESLint and Prettier
- [x] Create basic folder structure (components, pages, hooks, utils, types)

### A2. Authentication Foundation ✅
- [x] Install and configure Google OAuth 2.0 with PKCE
- [x] Create authentication context and hooks
- [x] Implement login/logout functionality
- [x] Create protected route wrapper
- [x] Add role-based access control (Admin, Clerk, Viewer)
- [x] Create login page with Google Sign-In button

### A3. Basic UI Framework ✅
- [x] Create layout components (Header, Sidebar, Footer)
- [x] Implement navigation with React Router
- [x] Create loading and error boundary components
- [x] Add toast notification system
- [x] Create basic responsive design

**Phase A Criteria**: ✅ User can log in with Google account, see basic app structure, navigate between protected routes

---

## Phase B: Metadata Integration 🔄
**Goal**: Connect to Google Sheets and display warehouse/cost type data

### B1. Google Apps Script Setup ✅
- [x] Create new Google Apps Script project
- [x] Set up Google Sheets with initial structure (Transactions, Warehouses, CostTypes)
- [x] Implement `GET /meta` endpoint
- [x] Add CORS headers and error handling
- [x] Deploy Apps Script as web app

### B2. Frontend API Integration ✅
- [x] Create API service layer
- [x] Implement data fetching hooks (useQuery pattern)
- [x] Add loading states and error handling
- [x] Create data types/interfaces for warehouses and cost types

### B3. Transaction Form ✅
- [x] Create "New Transaction" form component
- [x] Add dynamic dropdowns for warehouses and cost types
- [x] Implement form validation
- [x] Add currency selection (TJS, USD, EUR)
- [x] Create date picker component
- [x] Add income/expense toggle

**Phase B Criteria**: ✅ App loads warehouse and cost type data, transaction form shows dynamic dropdowns

---

## Phase C: Transaction Recording ✅
**Goal**: Save transactions to Google Sheets with validation

### C1. Backend Transaction Logic ✅
- [x] Implement `POST /txn` endpoint
- [x] Add transaction validation (required fields, data types)
- [x] Implement currency conversion to TJS
- [x] Add UUID generation for transaction IDs
- [x] Implement optimistic locking to prevent duplicates

### C2. Frontend Transaction Handling ✅
- [x] Connect transaction form to API
- [x] Implement optimistic UI updates
- [x] Add success/error toast notifications
- [x] Create transaction confirmation modal
- [x] Add form reset after successful submission

### C3. Data Validation ✅
- [x] Add client-side form validation
- [x] Implement server-side validation
- [x] Add currency rate validation
- [x] Create validation error display components

**Phase C Criteria**: ✅ Users can successfully save transactions, see immediate feedback, data is properly validated

---

## Phase D: CRUD for Reference Data ✅
**Goal**: Manage warehouses and cost types through UI

### D1. Warehouse Management ✅
- [x] Implement `POST /warehouse` endpoint
- [x] Create warehouse list component
- [x] Add warehouse creation form
- [x] Implement emoji picker for warehouses
- [x] Add color picker for warehouse branding
- [x] Add warehouse editing functionality
- [x] Implement warehouse deletion (with confirmation)

### D2. Cost Type Management ✅
- [x] Implement `POST /costType` endpoint
- [x] Create cost type list component
- [x] Add cost type creation form
- [x] Add direct/indirect cost toggle
- [x] Implement cost type editing
- [x] Add cost type deletion (with confirmation)

### D3. Reference Data UI ✅
- [x] Create "Reference Data" page with tabs
- [x] Implement inline editing for quick changes
- [x] Add search/filter functionality
- [x] Create bulk operations interface
- [x] Add data export functionality

**Phase D Criteria**: ✅ Admins can create/edit/delete warehouses and cost types, changes reflect immediately in transaction forms

---

## Phase E: Reporting Backend ✅
**Goal**: Calculate and cache profit analytics

### E1. Report Calculation Engine ✅
- [x] Implement `calcReport(month)` function
- [x] Calculate gross profit per warehouse
- [x] Calculate net profit per warehouse
- [x] Implement margin calculations
- [x] Add currency conversion for historical rates
- [x] Create profit trend calculations

### E2. Caching System ✅
- [x] Implement report caching in Snapshots sheet
- [x] Add cache invalidation on new transactions
- [x] Create cache warming for current month
- [x] Implement cache cleanup for old data

### E3. API Endpoints ✅
- [x] Implement `GET /report?month=YYYY-MM`
- [x] Implement `GET /snapshot?month=YYYY-MM`
- [x] Add performance optimization (< 200ms response)
- [x] Implement report data validation

**Phase E Criteria**: ✅ Reports calculate correctly, API responds quickly, data is cached efficiently

---

## Phase F: Dashboard Implementation ✅
**Goal**: Visual analytics with charts and filters

### F1. Chart Components ✅
- [x] Install and configure Recharts
- [x] Create revenue vs profit bar chart
- [x] Implement profit margin line chart
- [x] Create warehouse performance pie chart
- [x] Add KPI cards (total revenue, profit, margin)
- [x] Implement heat map for warehouse comparison

### F2. Dashboard Layout ✅
- [x] Create dashboard page layout
- [x] Add date range filters
- [x] Implement warehouse filter dropdown
- [x] Create responsive chart grid
- [x] Add chart loading states

### F3. Data Integration ✅
- [x] Connect dashboard to report API
- [x] Implement real-time data updates
- [x] Add data refresh functionality
- [x] Create export to PDF functionality
- [x] Implement chart interactions (drill-down)

**Phase F Criteria**: ✅ Dashboard loads in < 1s on 4G, charts display correctly, filters work properly

---

## Phase G: Mobile Optimization & QA ✅
**Goal**: Optimize for mobile and ensure quality

### G1. Mobile Responsiveness ✅
- [x] Optimize all components for mobile
- [x] Implement touch-friendly interactions
- [x] Add mobile-specific navigation
- [x] Optimize form layouts for small screens
- [x] Test on various mobile devices

### G2. PWA Features ✅
- [x] Implement offline caching with Workbox
- [x] Add "Add to Home Screen" functionality
- [x] Optimize service worker for performance
- [x] Implement background sync for offline transactions
- [x] Add push notifications for important updates

### G3. Performance Optimization ✅
- [x] Optimize bundle size
- [x] Implement code splitting
- [x] Add lazy loading for components
- [x] Optimize images and assets
- [x] Implement virtual scrolling for large lists

### G4. Quality Assurance ✅
- [x] Run Lighthouse audit (target ≥ 90)
- [x] Fix accessibility issues (a11y)
- [x] Test across different browsers
- [x] Perform security audit
- [x] Fix all identified bugs

**Phase G Criteria**: ✅ Lighthouse score ≥ 90, works offline, accessible, bug-free

---

## Phase H: Production Deployment & Training ✅
**Goal**: Deploy to production and train users

### H1. Production Deployment ✅
- [x] Deploy to GitHub Pages or Cloud Run
- [x] Configure custom domain
- [x] Set up SSL certificates
- [x] Configure environment variables
- [x] Set up monitoring and logging

### H2. Documentation ✅
- [x] Create user manual (PDF, one page)
- [x] Write technical documentation
- [x] Create deployment guide
- [x] Document API endpoints
- [x] Create troubleshooting guide

### H3. User Training ✅
- [x] Prepare training materials
- [x] Schedule Zoom briefing session
- [x] Create video tutorials
- [x] Set up support system
- [x] Conduct user acceptance testing

### H4. Go-Live Checklist ✅
- [x] Final security review
- [x] Performance testing under load
- [x] Backup procedures verification
- [x] Rollback plan preparation
- [x] Launch announcement

**Phase H Criteria**: ✅ App is live, users are trained, documentation is complete

---

## Technical Requirements

### Performance Targets
- [ ] Transaction recording: < 2s round-trip
- [ ] Report generation: < 2s response time
- [ ] Dashboard load: < 1s on 4G connection
- [ ] API response: < 200ms for cached data

### Security Requirements
- [ ] JWT token validation
- [ ] Email domain verification
- [ ] Protected ranges in Google Sheets
- [ ] CORS configuration
- [ ] Input sanitization

### Code Quality
- [ ] TypeScript strict mode
- [ ] ESLint configuration
- [ ] Prettier formatting
- [ ] Git hooks (pre-commit, pre-push)
- [ ] Code review process

### Monitoring & Maintenance
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User analytics
- [ ] Regular security updates
- [ ] Backup procedures

---

## Dependencies & Prerequisites

### Required Accounts
- [ ] Google Workspace account
- [ ] GitHub account
- [ ] Google Cloud Platform (optional)

### Required Permissions
- [ ] Google Sheets API access
- [ ] Google Apps Script deployment permissions
- [ ] Domain verification for OAuth

### Development Environment
- [x] Node.js 18+
- [ ] Git
- [ ] VS Code (recommended)
- [ ] Google Apps Script CLI (clasp)

---

## Success Metrics

### User Adoption
- [ ] 100% of warehouse staff using the app
- [ ] < 5% error rate in data entry
- [ ] Average session duration > 10 minutes

### Performance
- [ ] 99.9% uptime
- [ ] < 2s average response time
- [ ] < 1s dashboard load time

### Business Impact
- [ ] Reduced data entry time by 50%
- [ ] Real-time profit visibility
- [ ] Self-service warehouse management
