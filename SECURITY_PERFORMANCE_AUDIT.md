# Security & Performance Audit — Kids Online Shop

**Date:** 2026-06-01  
**Scope:** Full-stack audit (Laravel 10 backend + React frontend)

---

## Executive Summary

**39 issues found** across security (21) and performance (18) categories.

| Severity | Security | Performance | Total |
|----------|----------|-------------|-------|
| CRITICAL | 4 | 0 | 4 |
| HIGH | 7 | 8 | 15 |
| MEDIUM | 9 | 7 | 16 |
| LOW | 1 | 3 | 4 |

---

## CRITICAL ISSUES (Fix Immediately)

### C-1: Price lock-in between cart and checkout
**File:** `app/Services/CartService.php:36-48`, `OrderService.php:57-62`  
**Type:** Security — Business Logic

When a product is added to the cart, its price is frozen. At checkout time, the old cart price is used instead of re-querying the current product price. An attacker can add items during a sale, wait for the sale to end, and still purchase at the sale price.

**Fix:** Re-query `Product::findOrFail($productId)->current_price` at checkout time, not the cart's stored price.

---

### C-2: No database transactions in checkout
**File:** `app/Services/OrderService.php:21-79`  
**Type:** Security — Data Integrity

The entire 6-step checkout flow (create order → create items → process payment → deduct stock → clear cart) runs **outside any database transaction**. If any step fails after `Order::create()`, orphaned orders, double-charged payments, or inconsistent stock occur.

**Fix:** Wrap in `DB::transaction(function () { ... })`.

---

### C-3: TOCTOU race condition in stock operations
**Files:** `CartService.php`, `OrderService.php`, `StockService.php`  
**Type:** Security — Race Condition

Stock is checked (`hasSufficientStock`) and deducted (`decrement`) in separate operations. Two concurrent requests can both pass the check, causing overselling (negative stock). This is **amplified by SQLite** which has no row-level locking.

**Fix:** Use `DB::transaction()` with `lockForUpdate()`, or an atomic `UPDATE ... SET stock_quantity = stock_quantity - ? WHERE stock_quantity >= ?`.

---

### C-4: CORS wildcard origin with credentials
**File:** `config/cors.php:20-32`  
**Type:** Security — Configuration

```php
'allowed_origins' => ['*'],
'supports_credentials' => true,  // INVALID with wildcard origin
```

Per CORS spec, `Access-Control-Allow-Origin: *` is invalid when credentials are enabled. Browsers reject such responses.

**Fix:** Set specific allowed origins: `'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')]`.

---

## HIGH SEVERITY ISSUES

### Security

| # | Issue | File | Line |
|---|-------|------|------|
| H-1 | `price` mass-assignable in CartItem/OrderItem models | `app/Models/CartItem.php`, `OrderItem.php` | 9-14 |
| H-2 | `status/subtotal/total` mass-assignable in Order model | `app/Models/Order.php` | 10-18 |
| H-3 | No authorization gates/policies defined (only role middleware) | `app/Providers/AuthServiceProvider.php` | 15-25 |
| H-4 | Auth exceptions return 500 instead of 401 | `app/Exceptions/Handler.php` | 36-68 |
| H-5 | Debug mode leaks sensitive info via API errors | `app/Exceptions/Handler.php`, `.env` | 60-62 |
| H-6 | LIKE wildcards enable blind data enumeration | `ProductService.php`, `CategoryService.php`, `OrderService.php` | multiple |
| H-7 | `current_price` accessor fragile with null `sale_price` | `app/Models/Product.php` | 78-81 |

### Performance

| # | Issue | File | Line |
|---|-------|------|------|
| H-8 | Categories endpoint returns ALL records — no pagination | `app/Services/CategoryService.php` | 22 |
| H-9 | Zero caching across the entire application | All `Services/*.php` | — |
| H-10 | Dashboard runs 7 uncached queries on every admin page load | `app/Services/DashboardService.php` | 11-26 |
| H-11 | Missing database indexes on `category_id`, `user_id`, `order_id`, `product_id` | Migrations | multiple |
| H-12 | All pages eagerly imported (no code splitting) — 328KB bundle includes admin code for all users | `resources/js/App.jsx` | 8-21 |
| H-13 | Admin pages bundled in main JS (99% of users never visit them) | `resources/js/App.jsx` | 18-21 |
| H-14 | `OrderCreated` event defined, listeners registered, but **never dispatched** — dead/dormant code | `EventServiceProvider.php` | 21-24 |
| H-15 | Search input fires API request on every keystroke (no debounce) | `resources/js/pages/Products.jsx` | 22-34 |

---

## MEDIUM SEVERITY ISSUES

### Security

| # | Issue | File | Line |
|---|-------|------|------|
| M-1 | `role` field mass-assignable in User model (privilege escalation vector) | `app/Models/User.php` | 14-21 |
| M-2 | `user_id` mass-assignable in Cart model | `app/Models/Cart.php` | 9-11 |
| M-3 | All FormRequests return `authorize(): true` — no per-action fallback | 8 FormRequest files | ~9-12 |
| M-4 | AdminMiddleware returns 403 instead of 401 when user is null | `app/Http/Middleware/AdminMiddleware.php` | 13-18 |
| M-5 | Sanctum tokens never expire (`expiration => null`) | `config/sanctum.php` | 49 |
| M-6 | `description` fields lack `max` length constraint (DoS vector) | `ProductRequest.php`, `CategoryRequest.php` | 24, 22 |
| M-7 | SQLite for concurrent writes (no row-level locking, race condition amplifier) | `.env` | 11-12 |
| M-8 | No HTTPS enforced in middleware stack | `config/trustedproxy.php`, `Kernel.php` | — |
| M-9 | Sort-by/Sort-order not whitelisted (column enumeration possible) | `ProductService.php`, `OrderService.php` | 42-46 |

### Performance

| # | Issue | File | Line |
|---|-------|------|------|
| M-10 | `CategoryService::delete()` fires extra query instead of using pre-loaded `products_count` | `app/Services/CategoryService.php` | 56 |
| M-11 | `OrderService::getOrders()` doesn't eager-load `payment` (latent N+1) | `app/Services/OrderService.php` | 84 |
| M-12 | Frontend orders list ignores pagination metadata (only shows 1st page) | `resources/js/pages/Orders.jsx` | 18-22 |
| M-13 | Missing indexes on `stock_quantity`, `status`, `role` columns | Migrations | multiple |
| M-14 | Context values not memoized (AuthContext + CartContext → cascading re-renders) | `resources/js/contexts/*.jsx` | 52-56 |
| M-15 | Queue connection set to `sync` (blocking, no async processing) | `config/queue.php` | 16 |
| M-16 | `preventLazyLoading()` not enabled in development | `app/Providers/AppServiceProvider.php` | — |
| M-17 | LIKE '%...%' queries on `name`/`description` without full-text indexes | `app/Services/ProductService.php` | 16-19 |

---

## LOW SEVERITY ISSUES

| # | Issue | File | Line |
|---|-------|------|------|
| L-1 | Tokens created without specific abilities/scopes | `app/Services/AuthService.php` | 29 |
| L-2 | `stock_quantity`, `price` columns not marked `unsigned` | Migrations | multiple |
| L-3 | `tailwindcss` in `dependencies` instead of `devDependencies` | `package.json` | — |
| L-4 | No `React.memo()` on sticky Navbar (unnecessary re-renders on scroll) | `resources/js/components/Navbar.jsx` | — |

---

## Summary of Security Vulnerabilities by Category

| OWASP Category | Count | Key Issues |
|----------------|-------|------------|
| **A01: Broken Access Control** | 3 | Mass-assignable role/fields, no policies, 403 vs 401 |
| **A03: Injection** | 1 | LIKE wildcards enabling data enumeration |
| **A04: Insecure Design** | 4 | Price lock-in, no transactions, race condition, dead event |
| **A05: Security Misconfiguration** | 5 | CORS wildcard+credentials, debug=true, no HTTPS, no token expiry, SQLite |
| **A06: Vulnerable Components** | 0 | — |
| **A07: ID & Auth Failures** | 2 | No token abilities, no password reset |
| **A08: Data Integrity Failures** | 1 | No DB transactions |
| **A09: Logging & Monitoring** | 1 | No security event logging |
| **A10: SSRF** | 0 | — |

---

## Top 10 Fixes (Priority Order)

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | Wrap checkout in `DB::transaction()` | 15 min | Prevents data corruption |
| 2 | Re-query product price at checkout (fix price lock-in) | 30 min | Stops price exploitation |
| 3 | Atomic stock deduction (`UPDATE ... WHERE >= ?`) | 15 min | Prevents overselling |
| 4 | Fix CORS `allowed_origins` (no wildcard + credentials) | 5 min | Makes app work in browsers |
| 5 | Handle `AuthenticationException` → 401 in Handler | 10 min | Correct auth error codes |
| 6 | Set `APP_DEBUG=false` in .env | 1 min | Stops info leakage |
| 7 | Add `unsigned` constraints + missing DB indexes | 30 min | Prevents negative values, speeds queries |
| 8 | Add caching to dashboard + product/category lists | 2 hrs | Eliminates repeated DB hits |
| 9 | Add pagination to categories endpoint | 15 min | Prevents OOM with large datasets |
| 10 | Lazy-load admin pages with `React.lazy()` | 30 min | Reduces bundle for 99% of users |
