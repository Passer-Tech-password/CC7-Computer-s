# CC7 Computers (Next.js + Firebase + Tailwind)

CC7 Computers is a vibrant Nigerian-focused e-commerce + repairs platform built with Next.js App Router, TypeScript, Tailwind, Firebase Auth, and Firestore.

## Features

- Shop: product listing + product detail pages
- Cart (localStorage) + Checkout (Paystack simulation) + Orders saved to Firestore
- Repairs: booking flow + tracking UI + repair jobs saved to Firestore
- Admin/Staff dashboard: manage products, orders, repair jobs, customers
- Customer account: profile editing + orders + repair jobs
- WhatsApp modal + floating button

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (CC7 brand colors)
- Firebase Auth + Firestore

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy `.env.example` → `.env.local` and fill in values from Firebase Console:

```bash
cp .env.example .env.local
```

Required:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Optional:

- `NEXT_PUBLIC_API_URL` (PASSERTECH microservices base URL, example: `http://localhost:5000/api`)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (format: `+2347xxxxxxxxx`)
- `NEXT_PUBLIC_SITE_URL` (used for SEO metadataBase)

### 3) Firebase setup (Firestore)

Create these collections:

- `users`
- `products`
- `orders`
- `repair_jobs`

Suggested Firestore rules are in [firestore-notes.md](file:///c:/Users/DELL/Desktop/cc7-computer's/lib/firestore-notes.md).

### 4) Run locally

```bash
npm run dev
```

## Roles (Staff Dashboard Access)

Only these roles can access `/dashboard`:

- `staff`
- `admin`
- `technician`

How to set your role:

1. Log in to the app
2. Visit `/account` and copy your UID
3. In Firebase Console → Firestore → `users/{uid}`, set:

```json
{
  "role": "admin"
}
```

## Seeding demo data

The seed data lives in [seed.ts](file:///c:/Users/DELL/Desktop/cc7-computer's/lib/seed.ts).

Example usage (client-side, in a dev-only button):

```ts
import { getFirebaseClientAsync } from "@/lib/firebase";
import { seedFirestore } from "@/lib/seed";

const { db } = await getFirebaseClientAsync();
await seedFirestore({ db, userUidForRepairs: user.uid });
```

## Build / Export

This project uses static export:

- `output: "export"`
- `trailingSlash: true`

Build:

```bash
npm run build
```

Note (Windows): the build script force-cleans `out/` to avoid `ENOTEMPTY` issues.

## Scripts

- `npm run dev` – dev server
- `npm run build` – production build + static export
- `npm run lint` – ESLint
- `npm run typecheck` – TypeScript typecheck
