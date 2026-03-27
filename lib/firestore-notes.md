# Firestore Rules (example)

// Allow authenticated users to read/write their own orders and profile.
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    // Users collection
    match /users/{uid} {
      allow read: if isOwner(uid);
      allow write: if isOwner(uid);
    }

    // Orders collection
    match /orders/{orderId} {
      allow read, write: if isSignedIn() && request.resource.data.userUid == request.auth.uid;
    }

    // Products read-only
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }

    // Repair jobs readable by owner
    match /repair_jobs/{jobId} {
      allow read, write: if isSignedIn() && request.resource.data.userUid == request.auth.uid;
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

