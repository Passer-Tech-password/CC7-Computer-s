# Firestore Rules (example)

// Example rules:
// - Customers can read/write their own profile + their own orders/repair jobs
// - Staff/Admin/Technician can read/write all orders, repair jobs, and products
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }
    function isStaff() {
      return isSignedIn()
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'admin', 'technician'];
    }

    // Users collection
    match /users/{uid} {
      allow read: if isOwner(uid);
      allow write: if isOwner(uid);
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if isStaff() || (isSignedIn() && resource.data.userUid == request.auth.uid);
      allow create: if isStaff() || (isSignedIn() && request.resource.data.userUid == request.auth.uid);
      allow update, delete: if isStaff();
    }

    // Products
    match /products/{productId} {
      allow read: if true;
      allow write: if isStaff();
    }

    // Repair jobs
    match /repair_jobs/{jobId} {
      allow read: if isStaff() || (isSignedIn() && resource.data.userUid == request.auth.uid);
      allow create: if isStaff() || (isSignedIn() && request.resource.data.userUid == request.auth.uid);
      allow update, delete: if isStaff();
    }
  }
}

## Seed Data (products)

// Run in a Node script or console with Firebase Admin SDK:
// Add a few demo products to `products` with fields:
// {
//   id: "mbp-m2-13-2022",
//   name: "MacBook Pro (13-inch, M2, 2022)",
//   brand: "Apple",
//   model: "M2 / 8GB / 256GB",
//   category: "laptops",
//   condition: "new",
//   priceNgn: 1250000,
//   oldPriceNgn: 1390000,
//   imageUrl: "https://…",
//   stockCount: 12,
//   inStock: true,
//   createdAt: serverTimestamp()
// }
