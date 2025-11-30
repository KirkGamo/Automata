# Pumping Lemma Visualizer - Deployment Guide

## 🚀 Deployment Overview

Your React + Vite application is now configured for multiple deployment options:

### ✅ What's Been Set Up

1. **Production Build** - Already compiled and optimized
2. **Docker Containerization** - Multi-stage build with nginx
3. **Docker Compose** - Local testing configuration
4. **GitHub Actions CI/CD** - Automated testing and deployment
5. **Azure ARM Template** - Infrastructure as Code

---

## 📦 Option 1: Local Docker Testing (Fastest)

### Prerequisites
- Docker and Docker Compose installed

### Steps
```bash
cd c:\Users\Acer\school\Automata

# Build and run with Docker Compose
docker-compose up --build

# Application will be available at http://localhost:8080
```

**To stop:**
```bash
docker-compose down
```

---

## ☁️ Option 2: Deploy to Azure App Service (Recommended)

### Prerequisites
- Azure subscription
- Azure CLI installed: https://learn.microsoft.com/cli/azure/install-azure-cli-windows
- Git and GitHub account

### Step 1: Install Azure CLI
```powershell
# On Windows, use Chocolatey or direct download
# https://learn.microsoft.com/cli/azure/install-azure-cli-windows
```

### Step 2: Login to Azure
```bash
az login
```

### Step 3: Create Resource Group
```bash
az group create `
  --name pumping-lemma-rg `
  --location eastus
```

### Step 4: Deploy Infrastructure
```bash
az deployment group create `
  --name pumping-lemma-deploy `
  --resource-group pumping-lemma-rg `
  --template-file azure/deploy.json `
  --parameters appServicePlanSku=B1
```

### Step 5: Create Container Registry and Push Image
```bash
# Create registry (takes ~1-2 minutes)
az acr create `
  --resource-group pumping-lemma-rg `
  --name pumpinglemmaacr `
  --sku Basic

# Build and push Docker image
az acr build `
  --registry pumpinglemmaacr `
  --image pumping-lemma:latest .

# Get login credentials
az acr credential show `
  --resource-group pumping-lemma-rg `
  --name pumpinglemmaacr
```

### Step 6: Deploy to App Service
```bash
# Set variables
$APP_SERVICE_NAME="pumping-lemma-viz-<unique-suffix>"  # From deploy.json output
$REGISTRY_URL="pumpinglemmaacr.azurecr.io"
$IMAGE="$REGISTRY_URL/pumping-lemma:latest"

# Configure Docker image
az webapp config container set `
  --name $APP_SERVICE_NAME `
  --resource-group pumping-lemma-rg `
  --docker-custom-image-name $IMAGE `
  --docker-registry-server-url https://$REGISTRY_URL `
  --docker-registry-server-username <username> `
  --docker-registry-server-password <password>

# Enable continuous deployment
az webapp deployment container config `
  --name $APP_SERVICE_NAME `
  --resource-group pumping-lemma-rg `
  --enable-cd true
```

### Access Your App
```bash
# Get the URL
az webapp show `
  --name $APP_SERVICE_NAME `
  --resource-group pumping-lemma-rg `
  --query "defaultHostName" `
  --output tsv

# Then visit: https://<your-app-name>.azurewebsites.net
```

---

## 🔄 Option 3: Automated Deployment with GitHub Actions

### Prerequisites
- Repository pushed to GitHub
- Azure credentials configured

### Step 1: Create Azure Service Principal
```bash
az ad sp create-for-rbac `
  --name "github-pumping-lemma" `
  --role contributor `
  --scopes /subscriptions/<subscription-id>/resourceGroups/pumping-lemma-rg `
  --sdk-auth
```

### Step 2: Add GitHub Secret
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Create secret `AZURE_CREDENTIALS` with the output from above
3. Create secret `AZURE_RESOURCE_GROUP` with value: `pumping-lemma-rg`
4. Create secret `AZURE_APP_SERVICE_NAME` with your app service name

### Step 3: Push to Main Branch
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

The GitHub Actions workflow will automatically:
- Run linting and tests
- Build the Docker image
- Push to GitHub Container Registry
- Deploy to Azure App Service

---

## 🧪 Verify Deployment

### Check Application Status
```bash
# View logs
az webapp log tail `
  --name $APP_SERVICE_NAME `
  --resource-group pumping-lemma-rg

# Check container status
az container show `
  --resource-group pumping-lemma-rg `
  --name pumping-lemma-container `
  --query "containers[0].instanceView.currentState.state"
```

### Test Endpoints
```bash
# Test if app is running
curl https://<your-app-name>.azurewebsites.net
```

---

## 📊 Monitoring & Logs

### View Logs in Azure Portal
1. Azure Portal → App Service → Logs
2. Filter by deployment or time range

### Enable Application Insights
```bash
az monitor app-insights component create `
  --app pumping-lemma-insights `
  --location eastus `
  --resource-group pumping-lemma-rg

az webapp config appsettings set `
  --name $APP_SERVICE_NAME `
  --resource-group pumping-lemma-rg `
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=<key>
```

---

## 🧹 Cleanup

### Delete All Azure Resources
```bash
az group delete `
  --name pumping-lemma-rg `
  --yes
```

### Stop Local Docker Container
```bash
docker-compose down --volumes
```

---

## 📋 Troubleshooting

### Docker Build Fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild with no cache
docker-compose up --build --no-cache
```

### App Service Deploy Fails
```bash
# Check logs
az webapp log tail --name $APP_SERVICE_NAME --resource-group pumping-lemma-rg

# Restart app service
az webapp restart --name $APP_SERVICE_NAME --resource-group pumping-lemma-rg
```

### DNS Not Resolving
- Wait 2-5 minutes for DNS propagation
- Clear browser cache or use incognito mode
- Check certificate with: `openssl s_client -connect <your-app>.azurewebsites.net:443`

---

## 🔐 Security Checklist

- ✅ Environment variables configured
- ✅ HTTPS enforced (App Service handles this)
- ✅ Security headers set in nginx.conf
- ✅ Container scanning enabled
- ✅ No sensitive data in Dockerfile
- ✅ Regular updates scheduled

---

## 📚 Additional Resources

- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## 🎯 Next Steps

1. **Test locally first:**
   ```bash
   docker-compose up
   # Visit http://localhost:8080
   ```

2. **Deploy to Azure:**
   - Follow Option 2 above, or
   - Use Option 3 for automated deployment

3. **Monitor and maintain:**
   - Set up alerts in Azure Portal
   - Enable Application Insights
   - Review logs regularly

---

**Questions?** Check the Azure documentation or GitHub Actions logs for detailed error messages.
