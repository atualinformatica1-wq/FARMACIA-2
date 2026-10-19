# Security Specification & Threat Model

## 1. Data Invariants

- **Admins (`/admins/{adminId}`)**:
  - Only existing admins can read/write to the admins collection.
  - Initial bootstrapped admin: `atualinformatica1@gmail.com`.
  - Non-admins cannot elevate their privileges.

- **Products (`/products/{productId}`)**:
  - Publicly readable (`get`, `list`) by all store visitors and customers.
  - Creation, update, and deletion is restricted to authorized admins.
  - Product prices, stock, and descriptions must satisfy strict schema boundaries.

- **Categories (`/categories/{categoryId}`)**:
  - Publicly readable (`get`, `list`) by all visitors.
  - Mutation restricted strictly to admins.

- **Banners (`/banners/{bannerId}`)**:
  - Publicly readable (`get`, `list`) by all visitors.
  - Mutation restricted strictly to admins.

- **Settings (`/settings/{settingId}`)**:
  - Publicly readable (`get`, `list`) so store visitors can see pharmacy details, delivery fees, and Pix QR code payment info.
  - Mutation restricted strictly to admins.

- **Orders (`/orders/{orderId}`)**:
  - Any customer (guest or authenticated) can create a new valid order matching strict schema.
  - Document ID poisoning is prevented via `isValidId(orderId)`.
  - Order status updates, fulfillment updates, and deletion can ONLY be executed by admins.
  - Blanket listing of all orders is blocked for public/unauthenticated users; only admins can list all customer orders.
  - Individual orders can be fetched via `get` using valid ID for order tracking.

---

## 2. The "Dirty Dozen" Threat Payloads

1. **Ghost Field Poisoning in Product Create**: Injecting `{ "isAdminOverride": true }` into a product. Expected: Denied (or non-admin write blocked).
2. **Unauthenticated Product Deletion**: Guest attacker trying to DELETE `/products/prod-1`. Expected: Denied.
3. **Price Tampering on Product Update**: Non-admin attempting to change product price to R$ 0.01. Expected: Denied.
4. **Order List Data Scraping**: Unauthenticated attacker attempting to query/list all customer orders (`collection("orders")`). Expected: Denied.
5. **Malicious Order Status Hijack**: Non-admin attempting to UPDATE `/orders/ord-123` setting `status: "completed"`. Expected: Denied.
6. **Setting Poisoning (Pix Hijack)**: Non-admin trying to update `/settings/payment_methods` with their own Pix key and QR code. Expected: Denied.
7. **Admins Registry Privilege Escalation**: Non-admin trying to setDoc on `/admins/attacker_uid`. Expected: Denied.
8. **Banner Defacement**: Unauthenticated user attempting to insert or alter promotional banners. Expected: Denied.
9. **Junk ID Poisoning Attack**: Attempting to write an order with a 2KB junk character ID (`isValidId` failure). Expected: Denied.
10. **Order Negative Total Invariant Violation**: Submitting an order with negative total or negative items. Expected: Denied.
11. **Immortal Order Number Mutation**: Attempting to update an existing order's `orderNumber` or `createdAt`. Expected: Denied.
12. **Catch-All Wildcard Exploit**: Attempting to write to `/random_secret_collection/test`. Expected: Denied by global default-deny.
