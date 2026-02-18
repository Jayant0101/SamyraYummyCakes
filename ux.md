✅ STEP 1 — Install Required Libraries

Inside project:

npm install framer-motion
npm install clsx


Framer Motion → soft animations
clsx → cleaner class management

✅ STEP 2 — Upgrade Tailwind Design System

Open tailwind.config.js

Replace theme with this luxury palette:

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        blush: "#F6D6E6",
        gold: "#C8A96A",
        charcoal: "#4B4B4B",
      },
      borderRadius: {
        luxury: "24px",
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.08)",
      },
      backdropBlur: {
        luxury: "20px",
      },
    },
  },
  plugins: [],
};

✅ STEP 3 — Add Elegant Fonts

Open index.html

Add inside <head>:

<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">


Then in index.css:

body {
  font-family: 'Inter', sans-serif;
  background: #FAF7F2;
}

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
}

✅ STEP 4 — Create Luxury Layout Wrapper

Create:

src/components/Layout.tsx

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <div className="max-w-6xl mx-auto px-6">
        {children}
      </div>
    </div>
  );
}


Wrap your pages inside Layout.

✅ STEP 5 — Upgrade Navbar

Replace current navbar with:

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center py-6"
    >
      <h1 className="text-2xl font-semibold tracking-wide">
        Samyra Yummy Cakes
      </h1>

      <div className="space-x-8 text-sm">
        <a href="/" className="hover:text-gold transition">Home</a>
        <a href="/ai-chef" className="hover:text-gold transition">AI Chef</a>
      </div>
    </motion.nav>
  );
}

✅ STEP 6 — Transform Hero Section (Luxury Style)

Inside Home.tsx replace hero section with:

import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="py-20 grid md:grid-cols-2 gap-16 items-center">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl leading-tight mb-6">
          AI-Generated Cakes <br /> Designed Just For You
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Tell our AI Chef your vision and we craft a luxury masterpiece.
        </p>

        <button className="px-8 py-4 rounded-full bg-blush shadow-soft hover:scale-105 transition">
          Design Your Cake
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/50 backdrop-blur-luxury rounded-luxury shadow-soft p-6"
      >
        <img src="/cake-hero.jpg" className="rounded-luxury" />
      </motion.div>

    </section>
  );
}

✅ STEP 7 — Glassmorphism Card Style (Reusable)

Create:

src/components/GlassCard.tsx

export default function GlassCard({ children }) {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-luxury shadow-soft border border-white/40 p-6">
      {children}
    </div>
  );
}


Use this for:

Feature cards

AI preview

Menu previews

✅ STEP 8 — Add Soft Background Gradient

In index.css:

body {
  background: radial-gradient(circle at top left, #F6D6E6, #FAF7F2 60%);
}


Subtle. Elegant. Premium.

✅ STEP 9 — Improve AI Page UI (AIChef.tsx)

Wrap chat container inside:

<div className="bg-white/60 backdrop-blur-xl rounded-luxury shadow-soft p-8 max-w-3xl mx-auto">


Add spacing + serif headings.

✅ STEP 10 — Improve Button Style Globally

Add this class pattern:

className="px-6 py-3 rounded-full bg-blush hover:bg-gold text-charcoal transition-all duration-300 shadow-soft"


All buttons consistent.

✅ STEP 11 — Add Micro Animations

For cards:

className="hover:-translate-y-2 transition duration-300"


For buttons:

className="hover:scale-105 transition"


Luxury feel = subtle motion.

🎯 RESULT

After this:

✔ Soft pastel luxury feel
✔ Elegant serif typography
✔ Glassmorphism cards
✔ Smooth animations
✔ Premium brand identity
✔ Backend untouched