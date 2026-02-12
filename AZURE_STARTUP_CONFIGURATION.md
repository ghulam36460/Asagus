# Azure Web App Startup Configuration Guide

## ✅ Issue Fixed

The deployment workflows have been updated to remove the invalid `startup-command` parameter. The startup commands must be configured directly in Azure Portal.

---

## 🔧 How to Configure Startup Commands in Azure Portal

### **For Main Website (asagus-main)**

1. **Go to Azure Portal**: https://portal.azure.com
2. Navigate to your **asagus-main** App Service
3. In the left sidebar, click **Configuration** (under Settings)
4. Click the **General settings** tab
5. Find the **Startup Command** field
6. Enter: `bash startup.sh`
7. Click **Save** at the top
8. Click **Continue** to restart the app

### **For Admin Frontend (asagus-admin)**

1. Go to Azure Portal: https://portal.azure.com
2. Navigate to your **asagus-admin** App Service
3. In the left sidebar, click **Configuration** (under Settings)
4. Click the **General settings** tab
5. Find the **Startup Command** field
6. Enter: `node server.js`
7. Click **Save** at the top
8. Click **Continue** to restart the app

### **For Backend API (asagus-api)**

1. Go to Azure Portal: https://portal.azure.com
2. Navigate to your **asagus-api** App Service
3. In the left sidebar, click **Configuration** (under Settings)
4. Click the **General settings** tab
5. Find the **Startup Command** field
6. Enter: `bash startup.sh`
7. Click **Save** at the top
8. Click **Continue** to restart the app

---

## 📋 Alternative: Using Azure CLI

If you prefer to configure via command line:

```bash
# For Main Website
az webapp config set --resource-group <your-resource-group> \
  --name asagus-main \
  --startup-file "bash startup.sh"

# For Admin Frontend
az webapp config set --resource-group <your-resource-group> \
  --name asagus-admin \
  --startup-file "node server.js"

# For Backend API
az webapp config set --resource-group <your-resource-group> \
  --name asagus-api \
  --startup-file "bash startup.sh"
```

Replace `<your-resource-group>` with your actual Azure resource group name.

---

## 🔍 Verify Configuration

After setting the startup command:

1. Go to **Deployment Center** in your App Service
2. Check the **Logs** tab to see if the deployment succeeded
3. Visit your website URL to verify it's running
4. Check **Log stream** (under Monitoring) for runtime logs

---

## 📝 What the Startup Commands Do

### **`bash startup.sh` (Main Website & Backend)**
- Installs Node.js dependencies (`npm install` or `pnpm install`)
- Sets environment variables
- Starts the Next.js/Node.js server
- Handles port binding for Azure

### **`node server.js` (Admin Frontend)**
- Directly starts the Next.js standalone server
- Uses the built-in server.js from Next.js standalone build
- No dependency installation needed (already in build)

---

## ⚠️ Important Notes

1. **Startup commands are persistent** - You only need to set them once
2. **They survive redeployments** - The workflow no longer tries to override them
3. **Use Linux App Service** - These commands work with Linux-based App Services
4. **Windows Apps** - If using Windows, use different syntax (PM2 or IIS)

---

## 🚀 Deployment Process Now

1. **Push code to GitHub** → Triggers workflow
2. **GitHub Actions builds** → Creates deployment package
3. **Deploys to Azure** → Uses publish profile
4. **Azure uses configured startup command** → Starts your app
5. **App runs** → Ready to serve traffic

---

## 🐛 Troubleshooting

### Deployment succeeds but site doesn't load:

1. Check **Log stream** in Azure Portal
2. Verify the startup command is set correctly
3. Check if `startup.sh` has execute permissions:
   ```bash
   chmod +x startup.sh
   ```
4. Ensure environment variables are set in Azure (Configuration > Application settings)

### "startup-command" error persists:

- The workflows have been fixed
- Commit and push the updated `.github/workflows/*.yml` files
- The error should not appear in new deployments

---

## 📊 Quick Reference Table

| App Service      | Startup Command      | Purpose                           |
|------------------|---------------------|-----------------------------------|
| asagus-main      | `bash startup.sh`   | Main website (Next.js)            |
| asagus-admin     | `node server.js`    | Admin panel frontend (Next.js)    |
| asagus-api       | `bash startup.sh`   | Backend API services              |

---

## ✅ Checklist

- [ ] Update GitHub workflows (already done ✅)
- [ ] Configure startup command for asagus-main
- [ ] Configure startup command for asagus-admin
- [ ] Configure startup command for asagus-api
- [ ] Test deployment by pushing to main branch
- [ ] Verify all apps are running
- [ ] Check logs for any errors

---

## 🎯 Next Steps

After configuring the startup commands:

1. **Commit the workflow changes** to GitHub
2. **Push to main branch** to trigger deployment
3. **Monitor the deployment** in GitHub Actions
4. **Verify the apps** are running in Azure Portal

The deployment should now work without the `startup-command` error!
