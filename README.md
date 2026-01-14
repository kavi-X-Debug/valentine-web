Overview

- LoveCraft is a Valentine‑themed storefront for handcrafted gifts and couples.
- Built as a modern SPA with smooth navigation, animations, and an elegant romantic design.
- Live demo: https://valentine-webp.vercel.app/products
  
Key Features

- Product catalog with search, sort, price filters, and category browsing.
- Detailed product pages with quantity control and a lovely “Download Wish Image” card generator.
- Secure cart additions gated by login; favorites stored per user.
- Responsive layout, animated Navbar, and tasteful motion effects throughout.

Products Page

- Presents curated collections like Jewelry, Handmade, Gifts, Apparel, Personalized, Food, and Home.
- Inline filters for name search, price range, and quick price presets.
- Optional tag filtering and favorites view for signed‑in users.
- Fast grid with hover effects and add‑to‑cart prompts.

Authentication & Cart

- Firebase Authentication with email/password and Google sign‑in.
- Cart state is user‑scoped and persisted; guests are prompted to log in before adding items.
- Quantity management, price totals, and a clean checkout experience.

Tech Stack

- Frontend: React 18, Vite 5, React Router 6, Tailwind CSS.
- Animations: Framer Motion, Lucide icons.
- Backend services: Firebase (Auth, Firestore).
- Deployment: Vercel with SPA routing fallback.

Deployment

- Optimized for Vercel; a vercel.json config ensures deep links route to index.html.
- Production build: npm run build outputs to dist for hosting via CDN.
If you want, I can tailor this into a short GitHub “About” blurb and a longer README section with setup and contribution guidelines.
