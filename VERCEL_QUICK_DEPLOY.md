# ⚡ Deploy to Vercel in 2 Minutes

**No credit card. No subscription. Completely free.**

---

## 🎯 What You'll Do

1. Push code to GitHub
2. Connect Vercel to GitHub
3. One-click deploy
4. ✅ Done! Your app is live

---

## Step 1: Make Sure Code is on GitHub

```powershell
cd c:\Users\Acer\school\Automata

# Check if already pushed
git log --oneline | head -5

# If not, push now:
git add .
git commit -m "Add deployment configuration"
git push origin main
```

---

## Step 2: Sign Up for Vercel (1 minute)

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel
4. Done!

---

## Step 3: Import Your Project (1 minute)

1. After signing in, you'll see "New Project" button
2. Click "New Project"
3. Find and select "Automata" repository
4. Click "Import"

---

## Step 4: Configure (30 seconds)

Vercel auto-detects everything, but verify:

- **Framework Preset**: Select "Vite" (or auto-detected)
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

These should be auto-detected. Just click **Deploy**!

---

## Step 5: Done! 🎉

Your app is deploying now. In 30-60 seconds:
- ✅ Build completes
- ✅ HTTPS certificate added
- ✅ App goes live
- ✅ You get a URL

**Your URL:** `https://automata-<username>.vercel.app`

---

## 🧪 Test Your Deployed App

1. Visit your Vercel URL
2. Select a language
3. Generate a string
4. Decompose it
5. Pump it
6. Verify everything works!

---

## 🔄 Auto-Deploy on Updates

After the first deployment, every time you push to GitHub:

```powershell
git push origin main
```

Vercel automatically rebuilds and redeploys. No manual steps needed!

---

## 📊 Monitor Your Deployment

Visit your Vercel dashboard to:
- ✅ View deployment logs
- ✅ Check build status
- ✅ See performance metrics
- ✅ Manage settings

---

## 💡 Pro Tips

### Add Custom Domain (Optional)
1. In Vercel dashboard, click "Settings"
2. Go to "Domains"
3. Add your custom domain
4. Update DNS (Vercel will guide you)

### Preview Deployments
- Every pull request gets a preview URL
- Teammates can see changes before merging

### Environment Variables (Optional)
If you add backend later:
1. Settings → Environment Variables
2. Add your variables
3. Redeploy

---

## 🆘 Troubleshooting

### Build Failed
1. Check build logs in Vercel dashboard
2. Ensure `frontend/package.json` exists
3. Verify `npm run build` works locally

### App Shows Blank Page
- Check browser console for errors
- Verify `vite.config.ts` has correct `base` path
- For GitHub repo root: `base: '/'` is correct

### Still Stuck?
- Visit https://vercel.com/docs for help
- Check GitHub Actions log for build output

---

## ✅ You're Done!

Your Pumping Lemma Visualizer is now **live on the internet** with:
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deploy on git push
- ✅ Professional URL

**Share your app URL with your professor!**

---

**That's it! Vercel handles everything else.** 🚀
