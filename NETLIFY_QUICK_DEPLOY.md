# ⚡ Deploy to Netlify in 3 Minutes

**No credit card. No subscription. Completely free.**

Choose your method:

---

## Method A: GitHub Integration (Easiest)

### Step 1: Sign Up
1. Go to https://app.netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Netlify

### Step 2: Connect Your Repo
1. Click "New site from Git"
2. Select "GitHub"
3. Find "Automata" repository
4. Click "Install and authorize"

### Step 3: Configure Build Settings
1. **Base directory**: `frontend/`
2. **Build command**: `npm run build`
3. **Publish directory**: `frontend/dist`
4. Click "Deploy site"

**Done!** Your app is live in 1-2 minutes.

---

## Method B: Drag & Drop (Fastest - No GitHub Needed)

### Step 1: Sign Up
1. Go to https://app.netlify.com
2. Drag your `frontend/dist` folder into the window
3. Netlify uploads and deploys automatically

**That's it!** Your app is live immediately.

### To get the built dist folder:
```powershell
cd c:\Users\Acer\school\Automata\frontend
npm run build
# Now you have frontend/dist folder
```

---

## Your App URL

After deployment:
```
https://<your-site-name>.netlify.app
```

---

## 🔄 Auto-Deploy on Updates (Method A Only)

Every time you push to GitHub:
```powershell
git push origin main
```

Netlify automatically rebuilds and redeploys!

---

## 📊 Monitor Your Deployment

In Netlify dashboard:
- ✅ View deployment logs
- ✅ Check build status
- ✅ See analytics
- ✅ Manage settings

---

## 💡 Pro Tips

### Add Custom Domain
1. In Netlify dashboard, click "Domain settings"
2. Add your domain
3. Update DNS (Netlify will guide you)

### Continuous Deployment
- Netlify rebuilds on every GitHub push
- Preview URLs for pull requests
- Rollback to previous deployments

### Environment Variables
Settings → Build & deploy → Environment → Add variables

---

## 🆘 Troubleshooting

### Build Failed
1. Check "Deploys" tab for build logs
2. Verify `frontend/package.json` exists
3. Test locally: `npm run build`

### Site Shows Blank
- Clear browser cache
- Check browser console for errors
- Verify all files uploaded

### Drag & Drop Not Working
- Ensure you're dragging the `dist` folder
- Must be the build output folder

---

## ✅ You're Done!

Your app is now live with:
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deploy on git push (if using GitHub)
- ✅ Professional URL

**Share your app URL!** 🎉

---

**Choose one method and deploy in minutes.** 🚀
