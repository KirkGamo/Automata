# ⚡ Deploy to GitHub Pages in 5 Minutes

**Most FREE option. No external accounts needed. Built into GitHub!**

---

## What You Get

- ✅ Free hosting
- ✅ GitHub-native (no new account)
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Your URL: `https://KirkGamo.github.io/Automata`

---

## Step 1: Update vite.config.ts

Open `frontend/vite.config.ts` and add the `base` property:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Automata/',  // Add this line - match your repo name
  plugins: [react()],
})
```

Save the file.

---

## Step 2: Commit the Change

```powershell
cd c:\Users\Acer\school\Automata

git add frontend/vite.config.ts
git commit -m "Configure base path for GitHub Pages"
git push origin main
```

---

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/KirkGamo/Automata
2. Click **Settings** (top right)
3. Scroll down to **Pages** section (left sidebar)
4. Under "Source":
   - Select "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

---

## Step 4: GitHub Actions Workflow (Already Set Up!)

The workflow file is already created at:
```
.github/workflows/deploy-pages.yml
```

It automatically:
- Runs on every push to main
- Builds your app
- Deploys to GitHub Pages
- Takes 1-2 minutes

---

## Step 5: Wait for Deployment

1. Go to **Actions** tab in GitHub
2. Watch the workflow run
3. When it completes (green checkmark), your app is live!

---

## 🎉 Your App is Live!

Visit: **`https://KirkGamo.github.io/Automata`**

---

## 🔄 Auto-Deploy on Updates

Every time you push to main:
```powershell
git push origin main
```

GitHub Pages automatically:
1. Runs the build workflow
2. Deploys the new version
3. Updates your live site

**No manual steps needed!**

---

## 📊 Monitor Deployment

1. Go to **Actions** tab
2. Click the latest workflow run
3. See build logs and status
4. View deployment history

---

## 💡 Pro Tips

### Rollback to Previous Version
1. Go to Actions tab
2. Find the deployment you want
3. Re-run that workflow

### Custom Domain (Optional)
1. Settings → Pages
2. Custom domain field
3. Add your domain
4. Update DNS

### Troubleshooting

**Site Shows Blank:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito mode
- Check browser console for errors

**Build Failed:**
1. Check Actions tab for error logs
2. Verify `npm run build` works locally:
```powershell
cd frontend
npm run build
```
3. Check vite.config.ts has correct `base` path

**Takes Too Long:**
- First deployment takes ~2 minutes
- Subsequent deployments are faster

---

## ✅ You're Done!

Your Pumping Lemma Visualizer is now deployed to GitHub Pages with:
- ✅ Free hosting (no cost ever)
- ✅ GitHub-native (no external accounts)
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Professional URL

**Share your URL with your professor and classmates!** 🎉

---

## Quick Comparison

| Platform | Setup Time | Best For |
|----------|-----------|----------|
| **Vercel** | 2 min | Production apps |
| **Netlify** | 3 min | Static sites |
| **GitHub Pages** | 5 min | GitHub-first workflows |

---

**You chose the most FREE option! No external accounts needed.** 🚀
