# Billify

Offline-first Electron/PWA invoice billing software for **SHREE MAHESHWARA AGENCIES / SMA Billing** with GST-style sales documents, local persistence, secure login, print/PDF/share, customization, and backup tools.

## Masterplan

- Provide a Vyapar-like PC billing workspace for a small Indian business: dashboard, invoices, quotations, estimates, purchase orders, parties, products, ledger, expenses, reports, tools, settings, and backup.
- Keep billing usable offline through a static PWA, service-worker caching, `localStorage` persistence, and automatic IndexedDB mirroring for recovery.
- Generate INR/GST-ready business documents with customer/item rows, tax/discount, payment/balance tracking, company branding, print layouts, PDF export, and WhatsApp/share workflows.
- Default branding is **SHREE MAHESHWARA AGENCIES / SMA Billing**, while allowing customization of business details, logo, fonts, theme, document behavior, security, and data.
- Protect app routes with GenMB cloud authentication or local passcode authorization; login bypasses are intentionally not allowed.

## Tech Stack & Architecture

- **Electron desktop shell + static PWA**
  - `main.js` creates an Electron `BrowserWindow`, starts a no-cache local HTTP server on `127.0.0.1`, serves project files, and loads `index.html`.
  - If the local server fails, `main.js` falls back to `win.loadFile(index.html)`.
  - Electron uses `nodeIntegration: false`, `contextIsolation: true`, and a narrow bridge in `preload.js`.
  - Browser/PWA mode is driven by `index.html`, `manifest.json`, `manifest.webmanifest`, `offline.html`, and `sw.js`.

- **No-build React app**
  - Entry chain: `index.html` → `styles/main.css` → `src/main.js` → `src/mainProviders.js` → `src/App.js`.
  - React components use CDN ESM and `htm`; there is no JSX, TypeScript, Vite, Babel, or bundler.
  - Component syntax must remain:
    ```js
    import { html } from '../jsx.js';

    export function Example() {
      return html`<div className="card">Content</div>`;
    }
    ```
  - Do not add JSX/TSX, npm-only browser imports, or Node APIs inside `src/*` unless a real build pipeline is introduced.

- **Runtime CDN dependencies**
  - `src/jsx.js`: React `19.2.0` and `htm` from `https://esm.sh`.
  - `src/main.js`: `react-dom@19.2.0/client`.
  - `src/App.js` and components: `react-router-dom@7.13.0`.
  - Icons: `lucide-react` from `esm.sh`.
  - New browser dependencies must be ESM/CDN-compatible and should be added to `sw.js` cache coverage if offline use is expected.

- **Routing**
  - `src/App.js` uses `HashRouter`; keep hash routes for Electron file fallback, PWA shortcuts, and offline navigation.
  - Protected pages render inside `src/components/Layout.js` through `<Outlet />`.
  - `ProtectedRoute` redirects to `#/login` unless `useAuth()` reports a GenMB user or local passcode authorization.

- **State and persistence**
  - Main billing state lives in `src/store/useBillingStore.js`.
  - Primary persisted key: `shree-maheshwara-agencies-offline-v1`.
  - Global font settings key: `sma-global-font-settings-v1`; `index.html` applies font CSS variables before stylesheet load to avoid font flash.
  - `src/main.js` transparently mirrors `localStorage.setItem/removeItem` to IndexedDB:
    - DB: `sma-billing-db`
    - object store: `localstorage-mirror`
  - On startup, missing `localStorage` keys are restored from IndexedDB.
  - Normal application code should continue using the store/localStorage APIs; do not directly write billing data to IndexedDB.
  - `src/main.js` migrates missing or `public` `settings.securityMode` to `private`.

- **Authentication**
  - GenMB auth SDK is injected in `index.html` as `window.genmb.auth`.
  - `src/mainProviders.js` wraps the app, waits for auth readiness, subscribes to auth changes, and exposes `useAuth()`.
  - Supported GenMB actions include Google login, email magic link, email/password signup/login, password reset, `getUser`, `signOut`, and auth-state subscription.
  - Local passcode authorization is supported by the provider/store flow.
  - Do not weaken `ProtectedRoute` or create dev-only auth bypasses.

- **Desktop bridge/API surface**
  - `preload.js` exposes `window.desktopApp`:
    - `isElectron`, `appName`
    - `showSaveDialog(options)`
    - `showOpenDialog(options)`
    - `saveTextFile(options)`
    - `saveBinaryFile(options)`
    - `openDownloadsFolder()`
    - `openFileLocation(filePath)`
    - `openGeneratedFile(filePath)`
    - `writeTempAndCopyToClipboard(options)`
    - `shareFile(options)`
  - Matching IPC handlers live in `main.js`.
  - `src/main.js` shims `navigator.share`/`navigator.canShare` in Electron by sending file base64 to `desktopApp.shareFile`.

## File Structure

```text
.
├── app-version.json                  # Current app metadata; version 221 while HTML/manifest cache params are 220
├── index.html                        # PWA shell, GenMB auth injection, early font CSS-variable setup, root mount
├── main.js                           # Electron main process, static server, BrowserWindow, file/share IPC handlers
├── preload.js                        # Safe Electron bridge exposed as window.desktopApp
├── manifest.json                     # PWA manifest for SMA Billing shortcuts/icons
├── manifest.webmanifest              # Duplicate PWA manifest variant
├── offline.html                      # Service-worker fallback screen
├── sw.js                             # Offline cache/service worker; update when adding offline-critical assets/CDNs
├── styles/main.css                   # App theme, utility classes, print/document styling
├── assets/app-icon.svg               # Main SVG app icon
├── assets/icon-192.svg               # PWA 192 icon
├── assets/icon-512.svg               # PWA 512/maskable icon
└── src
    ├── jsx.js                        # React + htm binding; use html tagged templates instead of JSX
    ├── main.js                       # Browser entry, Electron share shim, localStorage→IndexedDB mirror, migrations
    ├── mainProviders.js              # Auth/provider wrapper and useAuth hook
    ├── App.js                        # HashRouter route table and strict ProtectedRoute
    ├── store/useBillingStore.js      # Central persisted billing/settings/customer/item/document state
    ├── components/Layout.js          # Sidebar/nav shell, account box, online/sync/update UI
    ├── components/CompanyPrintHeader.js # Reusable centered company header for printed documents
    ├── components/EmptyState.js      # Shared empty-state card
    ├── components/StatCard.js        # Dashboard/report statistic card
    ├── pages/Dashboard.js            # Overview metrics and quick access
    ├── pages/Tools.js                # Utility tools/calculator/notes-style workspace
    ├── pages/Invoices.js             # Invoice list/search/actions
    ├── pages/InvoiceEditor.js        # Create/edit invoice flow
    ├── pages/InvoiceView.js          # View/print/PDF/share invoice
    ├── pages/Quotations.js           # Quotation documents
    ├── pages/Estimates.js            # Estimate documents
    ├── pages/PurchaseOrders.js       # Purchase order documents
    ├── pages/Customers.js            # Parties/customer records
    ├── pages/Items.js                # Product/item master
    ├── pages/Ledger.js               # Party transaction ledger
    ├── pages/Expenses.js             # Expense records
    ├── pages/Reports.js              # Business/report summaries
    ├── pages/DataSync.js             # Backup/restore/cloud sync/data tools
    ├── pages/Settings.js             # Business, print, font, theme, security, document settings
    ├── pages/Login.js                # GenMB/local passcode login UI
    ├── pages/NotFound.js             # Unknown-route screen
    └── utils
        ├── cloudSync.js              # Cloud sync helpers/status persistence
        ├── companyPdf.js             # Company/document PDF generation helpers
        ├── whatsappPdf.js            # WhatsApp/share-oriented PDF helper
        └── format.js                 # INR/date/number formatting helpers
```

## Key Features

- **Secure access**
  - All business pages are behind `ProtectedRoute` in `src/App.js`.
  - Login options are implemented through GenMB auth and local passcode support.
  - Account controls are shown in `src/components/Layout.js`.

- **Sales documents**
  - Invoices: `src/pages/Invoices.js`, `src/pages/InvoiceEditor.js`, `src/pages/InvoiceView.js`.
  - Quotations, estimates, and purchase orders have dedicated pages: `Quotations.js`, `Estimates.js`, `PurchaseOrders.js`.
  - Documents should support customer selection, item rows, quantity/rate, GST-style tax, discounts, totals, paid amount, balance, print/PDF/share actions, and company branding.
  - Print headers should use `src/components/CompanyPrintHeader.js` for consistent centered branding.

- **Masters and finance**
  - Parties/customers: `src/pages/Customers.js`.
  - Products/items: `src/pages/Items.js`.
  - Ledger: `src/pages/Ledger.js`.
  - Expenses: `src/pages/Expenses.js`.
  - Reports/dashboard summaries: `src/pages/Reports.js`, `src/pages/Dashboard.js`.
  - Formatting utilities should use `src/utils/format.js` rather than ad-hoc currency/date formatting.

- **Customization**
  - `src/pages/Settings.js` controls company details, logo, document preferences, theme/font choices, and security settings.
  - Early font application in `index.html` depends on `sma-global-font-settings-v1`; if font settings change, keep this key and CSS-variable flow compatible.

- **Backup, sync, and recovery**
  - `src/pages/DataSync.js` handles backup/restore and sync workflows.
  - `src/utils/cloudSync.js` supports cloud sync behavior and status keys such as `sma-last-sync-status`.
  - Browser storage is mirrored to IndexedDB by `src/main.js` for local recovery.
  - In Electron, exports should use `window.desktopApp.saveTextFile/saveBinaryFile` when available so files land through native save dialogs.

- **Install/offline**
  - PWA metadata lives in both manifest files.
  - `Layout.js` tracks online/offline state and update availability.
  - `sw.js` must include new offline-critical files and CDN URLs; otherwise the app may work online but fail after install/offline.

## Design Guidelines

- Visual identity uses a soft desktop SaaS style with rounded cards, shadows, and purple/indigo primary branding.
- Primary app/icon colors:
  - Purple/indigo gradient in SVG icons: `#8b7bff` → `#5b4fff`.
  - PWA theme color: `#7667ff`.
  - App background in manifest: `#f2f0ed`.
- Styling is CSS-first through `styles/main.css`, with class names used directly in htm templates.
- The app uses CSS variables such as `--background`, `--foreground`, `--primary`, `--muted-foreground`, `--radius-md`, and `--shadow-md`.
- Typography is configurable. Default font stack is driven by `--app-font-family`, `--app-font-size`, and `--app-font-weight`.
- `CompanyPrintHeader.js` deliberately uses inline centering styles plus classes to keep printed company headers centered across browsers/PDF generation.
- Layout must remain usable at desktop sizes; Electron minimum is `1024x700`, default `1280x820`. `Layout.js` also supports mobile sidebar toggling for PWA/browser use.

## App Flow

- **Startup**
  1. Electron runs `main.js`, starts the local static server, and loads `index.html`; browser/PWA loads `index.html` directly.
  2. `index.html` applies saved font settings and loads `styles/main.css`.
  3. `src/main.js` installs Electron share shim, restores IndexedDB-mirrored storage, migrates `settings.securityMode`, then renders providers/app.
  4. `src/mainProviders.js` verifies GenMB session/local passcode state.
  5. `src/App.js` routes authenticated users to `#/dashboard`; unauthenticated users go to `#/login`.

- **Primary navigation**
  - Sidebar groups in `src/components/Layout.js`:
    - Main: Dashboard, Tools
    - Sales: Invoices, Quotations, Estimates, Purchase Orders
    - Records: Parties, Products, Ledger
    - Finance: Expenses, Reports
    - Data & Storage: Data / Backup
    - System: Settings

- **Invoice journey**
  1. User opens `#/invoices`.
  2. Creates document at `#/invoices/new` or edits `#/invoices/:id/edit`.
  3. Views document at `#/invoices/:id`.
  4. Prints, exports PDF, opens generated file, copies/shares through native Electron bridge or browser Web Share where available.

- **Offline edge cases**
  - If network/CDNs are not cached yet, first launch may require internet.
  - Once cached, app data should remain available from `localStorage` and IndexedDB mirror.
  - If `localStorage` is cleared but IndexedDB remains, `src/main.js` restores missing keys.
  - If service-worker cache misses a newly added asset/CDN dependency, installed/offline mode can break; update `sw.js`.

- **Version gotcha**
  - `app-version.json` reports version `221`, while `index.html`, manifests, icon URLs, and CSS links use `v=220`/meta version `220`. Keep these synchronized during releases to avoid stale PWA caches.

## Conventions

- Use htm tagged templates from `src/jsx.js`; never write JSX syntax in `.js` files.
- Prefer named exports for pages/components: `export function Customers() { ... }`.
- Keep route paths in `src/App.js` hash-router compatible.
- Add navigation entries in `navGroups` inside `src/components/Layout.js` when adding a protected page.
- For a new page:
  1. Create `src/pages/NewPage.js`.
  2. Import it in `src/App.js`.
  3. Add a `<Route>` under the protected `Layout`.
  4. Add a sidebar item in `Layout.js` if user-facing.
  5. Add any offline-critical file/CDN dependency to `sw.js`.
- Use `useBillingStore` for business data/settings. Do not create competing persistence keys unless the data is truly independent.
- Use `src/utils/format.js` for currency/date/number output.
- Use `window.desktopApp` only after feature detection:
  ```js
  if (window.desktopApp?.isElectron) { ... }
  ```
- Keep Electron IPC limited to file dialogs, export/open/share, and clipboard/temp-file capabilities already exposed by `preload.js`.
- Do not import `fs`, `path`, `electron`, or other Node modules from `src/*`.
- Preserve strict authentication. Testing changes should use real GenMB/local passcode flows, not route-guard bypasses.

## Platform (GenMB)

This app is built and hosted on GenMB.

**Runtime:** Browser sandbox (iframe) or Cloud Run. No Node.js server — all code runs client-side unless `backend/` exists.

**Dependencies:** CDN-only (esm.sh, cdn.tailwindcss.com, unpkg). Use ES module imports with full CDN URLs. No `npm install` at runtime.

**Entry point:** `index.html` must include all CDN script tags. Tailwind via CDN with inline config.

**Built-in services (relative API paths only, never hardcode domains):**
- `/api/ai/completion` — AI proxy | `/api/data/{appId}/*` — PostgreSQL (DataConnect SDK)
- `/api/storage/{appId}/*` — File uploads (GCS) | `/api/auth/google/*` — Google OAuth
- `/api/contact/submit` — Contact form | SDKs: `window.genmb.db`, `.storage`, `.auth`

**File structure:** `index.html` (entry), `src/` (source), `styles/` (CSS), `backend/` (optional FastAPI), `CLAUDE.md` (this file).

**Cannot:** Install npm packages at runtime, access filesystem, make direct server-side calls from frontend, modify infra.
