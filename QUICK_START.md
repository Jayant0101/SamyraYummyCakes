# Quick Start Guide (5 minutes)

## 🚀 Clone & Setup

```bash
# 1. Navigate to project
cd C:\Users\jayant\.gemini\antigravity\scratch\samyrayummyCakes

# 2. Create environment file
copy .env.example .env.local

# Edit .env.local and add your Gemini API key:
# VITE_API_URL=http://localhost:3000/api
# GEMINI_API_KEY=your_key_here
```

**Get Gemini API Key:**
1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy and paste in `.env.local`

## ⚙️ Install & Run

```bash
# 3. Install dependencies (first time only)
npm install

# 4. Start development server
npm run dev
```

**Output:**
```
VITE v7.3.1  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

**Open in browser:** http://localhost:5173

## ✅ Verify It Works

- [ ] Home page loads
- [ ] Navigation works (click nav links)
- [ ] Chat widget opens (bottom right)
- [ ] No red errors in console (F12)

## 🏗️ Build for Production

```bash
npm run build
```

Creates optimized `dist/` folder (~80 KB gzipped)

## 📤 Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Then:
# 1. Go to https://vercel.com
# 2. Click "Import Project"
# 3. Select your GitHub repo
# 4. Add GEMINI_API_KEY env var
# 5. Click Deploy
```

**Done!** App is live in ~2 minutes ✨

## 📂 Project Structure

```
src/
├── components/     ← Reusable UI components
├── pages/          ← Route pages (lazy loaded)
├── services/       ← API calls (api.ts is important!)
├── App.tsx         ← Main routing
├── main.tsx        ← Entry point
└── index.css       ← Tailwind styles

api/
├── concept.js      ← AI cake design generator
├── chat.js         ← Chat responses
└── image.js        ← Image generation (stub)
```

## 🛠️ Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Test production build
npm run lint         # Check code quality
```

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| Port 5173 in use | `npm run dev -- --port 3001` |
| Module not found | `npm install` then restart dev |
| GEMINI_API_KEY undefined | Add it to `.env.local` |
| API 500 error | Check `.env.local` has valid key |

## 📖 Full Documentation

- **Setup:** See `SETUP_GUIDE.md` (detailed)
- **Migration:** See `MIGRATION_GUIDE.md` (from old structure)
- **Review:** See `OPTIMIZATION_REVIEW.md` (technical details)

---

**Questions?** Open an issue or check docs above ✅
