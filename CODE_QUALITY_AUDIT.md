# Code Quality Audit — Kids Online Shop

**Date:** 2026-06-01  
**Scope:** Full codebase (Laravel 10 backend + React/Vite frontend)

---

## Executive Summary

**61 issues found** — 3 CRITICAL, 14 HIGH, 29 MEDIUM, 15 LOW.

| Layer | CRITICAL | HIGH | MEDIUM | LOW |
|-------|----------|------|--------|-----|
| Backend (Laravel) | 3 | 8 | 15 | 12 |
| Frontend (React) | 0 | 4 | 14 | 5 |
| **Total** | **3** | **12** | **29** | **17** |

---

## CRITICAL ISSUES

### C-1: Admin controllers delegate to public controllers via `app()` instead of using injected services
**Files:** `app/Http/Controllers/Api/V1/Admin/CategoryController.php`, `ProductController.php`  
**Lines:** 22, 27, 32, 37, 42

```php
return app(\App\Http\Controllers\Api\V1\CategoryController::class)->index($request);
```

Admin controllers do NOT use their constructor-injected services. Instead, they instantiate public controllers via the service locator `app()`. This:
- Wastes the injected `CategoryService`/`ProductService` on every request
- Creates hidden coupling to the public controller's dependency tree
- Bypasses Laravel's controller lifecycle (middleware, route model binding)

**Fix:** Inject the appropriate service and call it directly, just like the public controllers do.

---

### C-2: No database transactions in checkout (data integrity)
**File:** `app/Services/OrderService.php:21-80`

The checkout flow (create order → create items → process payment → deduct stock → clear cart) is not wrapped in `DB::transaction()`. Any failure after `Order::create()` leaves orphaned records.

**Fix:** Wrap in `DB::transaction(function () { ... })`.

---

### C-3: TOCTOU race condition in stock operations
**Files:** `app/Services/CartService.php`, `OrderService.php`, `StockService.php`

Stock check and decrement are separate operations. Concurrent requests can oversell inventory.

**Fix:** Use `lockForUpdate()` inside a transaction, or atomic `UPDATE ... SET stock_quantity = stock_quantity - ? WHERE stock_quantity >= ?`.

---

## HIGH SEVERITY ISSUES

### Backend

| # | Issue | File | Line |
|---|-------|------|------|
| H-1 | `price` mass-assignable in CartItem/OrderItem | `app/Models/CartItem.php`, `OrderItem.php` | 9-14 |
| H-2 | `status/subtotal/total` mass-assignable in Order | `app/Models/Order.php` | 10-18 |
| H-3 | No route model binding — manual `findOrFail` everywhere | All `Controllers/Api/V1/*` | — |
| H-4 | `OrderCreated` event registered with listeners, but **never dispatched** | `app/Providers/EventServiceProvider.php`, `OrderService.php` | 21-24 |
| H-5 | `ProductCollection` resource class defined but never used | `app/Http/Resources/ProductCollection.php` | entire file |
| H-6 | `Order::generateOrderNumber()` static method never called (inline duplicate in service) | `app/Models/Order.php:45-52`, `OrderService.php:45` | — |
| H-7 | DashboardController has 5 unused imports | `app/Http/Controllers/Api/V1/Admin/DashboardController.php` | 6-11 |
| H-8 | Inconsistent try/catch — some service calls wrap exceptions, others don't | Multiple controllers | — |

### Frontend

| # | Issue | File | Line |
|---|-------|------|------|
| H-9 | **No error boundaries** — any render crash = blank white screen | All components | — |
| H-10 | `Orders.jsx` has no `.catch()` on API call — permanent spinner on failure | `resources/js/pages/Orders.jsx` | 18-22 |
| H-11 | `OrderDetail.jsx` has no `.catch()` — permanent spinner on failure | `resources/js/pages/OrderDetail.jsx` | 19-23 |
| H-12 | **Form labels lack `htmlFor`/`id` pairing** — all forms inaccessible to screen readers | Login.jsx, Register.jsx, Checkout.jsx, admin forms | multiple |

---

## MEDIUM SEVERITY ISSUES

### Backend — Architecture & Design

| # | Issue | File | Line |
|---|-------|------|------|
| M-1 | Slug generation logic duplicated in model boot events AND service methods (4 places) | `Product.php`, `Category.php`, `ProductService.php`, `CategoryService.php` | multiple |
| M-2 | `request()` global helper used instead of injected `$request` | `AuthController.php`, `CartController.php` | multiple |
| M-3 | `PaymentService` hardcodes `'cod' => new CodPayment()` in constructor — violates Open/Closed | `app/Services/Payment/PaymentService.php` | 11-14 |
| M-4 | Admin/ProductController::lowStock() resolves service via `app()` despite having injected instance | `app/Http/Controllers/Api/V1/Admin/ProductController.php` | 47 |
| M-5 | `CartController::index()` returns different shapes for empty vs non-empty cart | `app/Http/Controllers/Api/V1/CartController.php` | 24-35 |
| M-6 | Empty cart data structure `['items'=>[], 'subtotal'=>0, 'total'=>0]` duplicated in index() and clear() | `app/Http/Controllers/Api/V1/CartController.php` | 25-29, 88-92 |
| M-7 | `CartItem` and `OrderItem` have identical `getSubtotalAttribute()` — extract to trait | `app/Models/CartItem.php:31-34`, `OrderItem.php:31-34` | — |
| M-8 | `CartItemResource` and `OrderItemResource` are nearly identical | `app/Http/Resources/CartItemResource.php`, `OrderItemResource.php` | — |

### Backend — Error Handling & Type Safety

| # | Issue | File | Line |
|---|-------|------|------|
| M-9 | `AuthService::logout()` does not check `currentAccessToken()` for null | `app/Services/AuthService.php` | 36 |
| M-10 | Missing return types on `CategoryService::list()`, `CartService::getOrCreateCart()`, `CartController` methods | Multiple files | — |
| M-11 | `ProductResource` is inconsistent — some fields cast with `(float)`, others (`current_price`) not | `app/Http/Resources/ProductResource.php` | 20-22 |
| M-12 | If `process()` is called twice for the same order (bugs), duplicate payment records are created | `app/Services/Payment/PaymentService.php` | 21 |

### Backend — Dead Code & Boilerplate

| # | Issue | File | Line |
|---|-------|------|------|
| M-13 | `AppServiceProvider` has empty `register()` and `boot()` — does nothing | `app/Providers/AppServiceProvider.php` | — |
| M-14 | `AuthServiceProvider` has empty `$policies = []` and empty `boot()` | `app/Providers/AuthServiceProvider.php` | — |
| M-15 | `Handler::register()` has empty closure with no-op comment | `app/Exceptions/Handler.php` | 22-24 |

### Frontend — Code Duplication

| # | Issue | File | Line |
|---|-------|------|------|
| M-16 | **Loading spinner JSX duplicated in 8+ files** — should be shared component | ProtectedRoute, AdminRoute, Products, ProductDetail, Orders, OrderDetail, Dashboard | — |
| M-17 | **Pagination UI duplicated in 3 files** — should be shared component | Products.jsx, admin/Products.jsx, admin/Orders.jsx | — |
| M-18 | **`statusColors` object duplicated in 3 files** — should be constants file | Orders.jsx, OrderDetail.jsx, admin/Orders.jsx | 5-12 |
| M-19 | **Price formatting `${n?.toLocaleString()} Ks` in 15+ places** — should be utility function | Throughout codebase | — |
| M-20 | Duplicate entry point files (`app.jsx` and `main.jsx`) — identical content | `resources/js/app.jsx`, `resources/js/main.js` | entire files |

### Frontend — React Architecture

| # | Issue | File | Line |
|---|-------|------|------|
| M-21 | **Context values not memoized** — AuthContext and CartContext cause cascading re-renders | `resources/js/contexts/AuthContext.jsx:52-56`, `CartContext.jsx:73-77` | — |
| M-22 | **Context functions not wrapped in `useCallback`** (except `fetchCart`) | `resources/js/contexts/CartContext.jsx` | — |
| M-23 | **No `PropTypes` on any component** — no runtime type checking | All components | — |
| M-24 | `AdminProducts` is 212 lines (too large) — extract form modal and table | `resources/js/pages/admin/Products.jsx` | — |
| M-25 | `AdminCategories` is 135 lines — extract form modal and table | `resources/js/pages/admin/Categories.jsx` | — |

### Frontend — Error Handling

| # | Issue | File | Line |
|---|-------|------|------|
| M-26 | **`alert()` used for errors in admin CRUD pages** (3 occurrences) — blocks UX | `admin/Products.jsx`, `admin/Categories.jsx`, `admin/Orders.jsx` | — |
| M-27 | **No error state on Home.jsx** — failed API calls silently swallowed | `resources/js/pages/Home.jsx` | 11-16 |
| M-28 | **No error state on Dashboard.jsx** — stats silently default to 0 on failure | `resources/js/pages/admin/Dashboard.jsx` | 9-13 |
| M-29 | **AuthContext removes token on ANY error** — 500 errors cause silent logout | `resources/js/contexts/AuthContext.jsx` | 23 |

---

## LOW SEVERITY ISSUES

| # | Issue | File | Line |
|---|-------|------|------|
| L-1 | `CodPayment` naming — should be `CODPayment` or `CashOnDeliveryPayment` | `app/Services/Payment/CodPayment.php` | 8 |
| L-2 | Controller method naming inconsistent — `add`/`remove` vs `store`/`destroy` | `app/Http/Controllers/Api/V1/CartController.php` | — |
| L-3 | Cart controller methods missing return type hints (`JsonResponse`) | `app/Http/Controllers/Api/V1/CartController.php` | — |
| L-4 | `AuthService::register()` return type `User` should be `Model|User` | `app/Services/AuthService.php` | 11 |
| L-5 | Order status strings hardcoded in 5+ files — needs enum | Multiple files | — |
| L-6 | Role strings `'customer'`/`'admin'` hardcoded in 3+ files | `AuthService.php:14`, `User.php:35`, `DashboardService.php:14` | — |
| L-7 | `'ORD-'` order prefix hardcoded in 2 places | `OrderService.php:45`, `Order.php:47` | — |
| L-8 | Default `per_page: 15` hardcoded in 3 services | `ProductService.php:44`, `OrderService.php:87,117` | — |
| L-9 | Low-stock threshold `10` hardcoded inconsistently | `Product.php:72`, `ProductService.php:87` | — |
| L-10 | `bcrypt()` helper in seeder instead of `Hash::make()` or model `hashed` cast | `database/seeders/DatabaseSeeder.php` | 16, 26 |
| L-11 | Unused `import React` in every .jsx file (React 17+ JSX transform makes it optional) | All .jsx files | 1 |
| L-12 | Footer uses `<a>` instead of `<Link>` — full page reloads | `resources/js/components/Footer.jsx` | 15-17 |
| L-13 | SVG icons lack `aria-label` for screen readers | `Navbar.jsx:26-28`, `Cart.jsx:96-98` | — |
| L-14 | Pagination buttons lack `aria-label` | `Products.jsx`, `admin/Products.jsx`, `admin/Orders.jsx` | — |
| L-15 | `bootstrap.js` sets `window.axios` but React never uses it | `resources/js/bootstrap.js` | 8 |

---

## Top 10 Fixes (Priority Order)

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | Fix Admin controllers to use injected services (C-1) | 15 min | Removes hidden coupling, fixes wasted DI |
| 2 | Add DB transaction to checkout (C-2) | 15 min | Prevents data corruption |
| 3 | Add `.catch()` to Orders/OrderDetail API calls (H-10, H-11) | 5 min | Prevents permanent spinners |
| 4 | Add `htmlFor`/`id` to all form labels (H-12) | 20 min | Fixes screen reader accessibility |
| 5 | Extract loading spinner into shared component (M-16) | 15 min | Eliminates 8x code duplication |
| 6 | Memoize context values in AuthContext + CartContext (M-21) | 10 min | Stops cascading re-renders |
| 7 | Replace `alert()` with inline error banners in admin (M-26) | 15 min | Consistent UX |
| 8 | Add error handling to Home/Dashboard API calls (M-27, M-28) | 10 min | Shows errors instead of silent failure |
| 9 | Extract `statusColors`, price formatting, pagination into shared files (M-17, M-18, M-19) | 30 min | DRY codebase |
| 10 | Add error boundary component (H-9) | 20 min | Prevents blank white screen on crash |

---

## Code Quality Observations by Principle

### SOLID Compliance
| Principle | Status | Notes |
|-----------|--------|-------|
| **SRP** | ✅ Mostly good | Controllers thin, services focused. `OrderService::checkout()` is borderline (orchestrates too many sub-processes) |
| **OCP** | ❌ Violation | `PaymentService` hardcodes driver registration in constructor; adding a new method requires modifying the class |
| **LSP** | ✅ OK | `CodPayment` correctly implements `PaymentDriver` interface |
| **ISP** | ✅ OK | `PaymentDriver` has a single method |
| **DIP** | ✅ Mostly | Constructor injection used consistently, except admin controllers using `app()` service locator |

### Laravel Best Practices
| Practice | Status | Notes |
|----------|--------|-------|
| Route model binding | ❌ Not used | All controllers use `int $id` + manual `findOrFail` |
| FormRequest authorization | ❌ `authorize()` always returns `true` | No per-action fallback if route middleware is omitted |
| Resource collections | ❌ `ProductCollection` defined but unused | Inline `through()` used instead |
| Model `$fillable` | ⚠️ Too permissive | `role`, `price`, `status` should not be fillable |
| Eager loading | ✅ Good | Most services eager-load relationships |

### React Best Practices
| Practice | Status | Notes |
|----------|--------|-------|
| Key props | ✅ Good | All lists have proper keys |
| Hooks rules | ✅ Good | No conditional hook calls |
| Context memoization | ❌ Missing | `useMemo` not used on context values |
| Callback memoization | ⚠️ Partial | Only `fetchCart` uses `useCallback` |
| Error boundaries | ❌ Missing | No error boundary anywhere |
| Code splitting | ❌ Missing | All pages eagerly imported including admin |
| PropTypes | ❌ Missing | No runtime type checking |
| Accessibility | ⚠️ Poor | Labels, aria-labels, semantic forms all need work |

---

## Summary

The codebase has a solid architectural foundation (clean service layer, good separation of concerns) but suffers from:

1. **Inconsistent patterns** — some errors caught, others not; some values cached in context, others not
2. **Duplicated code** — loading spinners, pagination, status colors, price formatting repeated throughout
3. **Missing React fundamentals** — error boundaries, code splitting, memoization, PropTypes
4. **Dead code** — unused resource class, unused static method, never-dispatched event, duplicate entry files
5. **Incomplete accessibility** — forms not labelled, icons not announced, keyboard navigation gaps
