# Migration Guide: From Old Structure to Optimized

## 🎯 Purpose
This guide explains how to migrate from your old project structure to the new optimized Vite + TypeScript setup.

---

## 📋 What's Changing

### Removed / Deprecated
- ❌ Create React App (CRA)
- ❌ Old webpack config
- ❌ Legacy scripts
- ❌ Direct Gemini imports in components

### Added / Improved
- ✅ Vite (10x faster builds)
- ✅ TypeScript (full coverage)
- ✅ Serverless API functions
- ✅ Tailwind CSS (from scratch)
- ✅ Lazy-loaded routes
- ✅ Error boundaries

---

## 🔄 Migration Steps

### Option 1: Full Replace (Recommended)
**Best if:** Starting fresh or minimal custom code

```bash
# Backup your old project
cp -r old-project old-project-backup

# Copy new project
cp -r scratch/samyrayummyCakes/* ./

# Install dependencies
npm install

# Test locally
npm run dev:all:all
```

### Option 2: Selective Migration
**Best if:** You have significant custom code

#### Step 1: Update package.json
Replace `scripts` section:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

Replace `dependencies`:
```json
{
  "dependencies": {
    "lucide-react": "^0.566.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-hook-form": "^7.71.1",
    "react-router-dom": "^7.13.0"
  }
}
```

#### Step 2: Copy New Config Files
```bash
cp scratch/samyrayummyCakes/vite.config.ts ./
cp scratch/samyrayummyCakes/tailwind.config.js ./
cp scratch/samyrayummyCakes/postcss.config.js ./
cp scratch/samyrayummyCakes/tsconfig.json ./
```

#### Step 3: Update src/ Structure
```bash
# Backup old src
mv src src-old

# Copy new src
cp -r scratch/samyrayummyCakes/src/* ./src/

# Merge custom code from src-old as needed
# (components, pages, services)
```

#### Step 4: Copy API Functions
```bash
# Create api folder
mkdir -p api

# Copy serverless functions
cp scratch/samyrayummyCakes/api/*.js ./api/
```

#### Step 5: Update Environment
```bash
cp scratch/samyrayummyCakes/.env.example ./
mv .env.example .env.local
# Edit .env.local with your API key
# GOOGLE_API_KEY=...
```

#### Step 6: Update index.html
Replace with:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Samyra's Yummy Cakes</title>
    <meta name="description" content="Order delicious, custom-made cakes or design your own with our AI Chef.">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### Step 7: Install Dependencies
```bash
npm install
```

---

## 🔄 Code Migration Examples

### Example 1: Updating Component Imports

**OLD** (Create React App):
```tsx
import styles from './Button.module.css';

const Button = () => <button className={styles.btn}>Click</button>;
```

**NEW** (Tailwind):
```tsx
const Button = () => <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded">Click</button>;
```

### Example 2: API Calls

**OLD** (Direct Gemini):
```tsx
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const result = await genAI.generateContent(prompt);
```

**NEW** (Via API Service):
```tsx
import { generateCakeConcept } from '@/services/api';

const result = await generateCakeConcept(prompt);
```

### Example 3: Environment Variables

**OLD** (CRA):
```
GOOGLE_API_KEY=sk-...
```

**NEW** (Vite):
```
VITE_API_URL=http://localhost:3000/api
GOOGLE_API_KEY=sk-...  (server-side only)
```

### Example 4: Styling

**OLD** (CSS Modules):
```tsx
import styles from './Card.module.css';
export const Card = () => <div className={styles.cardContainer}>{content}</div>;
```

**NEW** (Tailwind):
```tsx
export const Card = () => <div className="bg-white p-6 rounded-lg shadow-md">{content}</div>;
```

---

## 🚨 Breaking Changes

### 1. Asset Imports
**Before:**
```tsx
import logo from './logo.svg';
<img src={logo} alt="logo" />
```

**After:**
```tsx
<img src="/logo.svg" alt="logo" />
// OR use vite syntax:
import logo from '/logo.svg?url';
```

### 2. Environment Variables
**Before:**
```
REACT_APP_MY_VAR=value
// Access: process.env.REACT_APP_MY_VAR
```

**After:**
```
VITE_MY_VAR=value
// Access: import.meta.env.VITE_MY_VAR
```

### 3. Module Resolution
**Before:**
```tsx
import Button from '../../../components/Button';
```

**After:**
```tsx
import Button from '@/components/Button';
```

### 4. API Routes
**Before:**
```tsx
fetch('/api/concept') // Goes to backend
```

**After:**
```tsx
fetch('http://localhost:3000/api/concept') // Or VITE_API_URL
```

---

## ✅ Verification Checklist

After migration, verify:

- [ ] `npm install` succeeds without errors
- [ ] `npm run dev:all` starts on http://localhost:5173
- [ ] Home page loads without errors
- [ ] Navigation works (all routes)
- [ ] Chat widget opens/closes
- [ ] No console errors
- [ ] Tailwind styles apply correctly
- [ ] Images load properly
- [ ] API calls work (check Network tab)
- [ ] Build completes: `npm run build`
- [ ] Preview works: `npm run preview`

---

## 🆘 Common Issues & Fixes

### Issue: "Module not found" error
```
Error: Cannot find module '@google/generative-ai'
```
**Solution:** This is expected. Use the API service instead:
```tsx
import { generateCakeConcept } from '@/services/api';
```

### Issue: "VITE_API_URL is undefined"
```
fetch(${process.env.VITE_API_URL}/api) // → /api
```
**Solution:** Use `import.meta.env`:
```tsx
const url = import.meta.env.VITE_API_URL || '/api';
fetch(`${url}/concept`);
```

### Issue: Tailwind classes not applying
**Solution:** Check `tailwind.config.js` content paths:
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

### Issue: "ReferenceError: process is not defined"
**Solution:** Replace `process.env` with `import.meta.env`:
```tsx
// OLD: const key = process.env.REACT_APP_KEY;
// NEW:
const key = import.meta.env.VITE_KEY;
```

### Issue: Fonts not loading
**Solution:** Verify Google Fonts link in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
```

### Issue: Images not optimized
**Solution:** Verify `vite.config.ts`:
```ts
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

plugins: [
  react(),
  ViteImageOptimizer({})
]
```

---

## 📚 Learning Resources

If you're new to these technologies:

- **Vite Guide:** https://vitejs.dev/guide/
- **React 19:** https://react.dev/blog/2024/12/19/react-19
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com/docs
- **Vercel Deployment:** https://vercel.com/docs

---

## 🎯 Post-Migration Steps

1. **Clean up old code**
   ```bash
   rm -rf src-old node_modules
   ```

2. **Test thoroughly**
   ```bash
   npm run dev:all
   # Test all pages, features, API calls
   ```

3. **Update documentation**
   - Update README.md with new setup instructions
   - Document any custom changes

4. **Deploy**
   ```bash
   npm run build
   git add .
   git commit -m "Migrate to Vite + TypeScript"
   git push origin main
   ```

5. **Monitor**
   - Check Vercel dashboard
   - Monitor performance metrics
   - Watch error logs

---

## 💡 Tips

1. **Use the `@` alias** for cleaner imports:
   ```tsx
   import { Button } from '@/components/Button';  // ✅ Better
   // instead of
   import { Button } from '../../../components/Button';  // ❌ Avoid
   ```

2. **Lazy load heavy pages:**
   ```tsx
   const AdminPage = lazy(() => import('@/pages/Admin'));
   ```

3. **Keep API service centralized:**
   - All API calls via `@/services/api.ts`
   - Easy to mock for testing
   - Single place to add auth/error handling

4. **Use Tailwind plugins** for custom components:
   ```js
   @layer components {
     @apply rounded-lg p-4 shadow-md;
   }
   ```

5. **Monitor bundle size:**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

---

## 📞 Need Help?

- Check SETUP_GUIDE.md for detailed setup instructions
- Review OPTIMIZATION_REVIEW.md for architecture details
- Open GitHub Issues for bugs
- Ask in Vercel Discussions for deployment help

---

**Happy migrating! 🚀**

Questions? Review the guides or reach out!
