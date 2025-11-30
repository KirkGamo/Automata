# Azure Deployment Guide for Pumping Lemma Visualizer

## Prerequisites
- Azure CLI installed (`az --version`)
- Docker installed (for local testing)
- An Azure subscription

## Quick Start

### 1. Login to Azure
```bash
az login
```

### 2. Create a Resource Group
```bash
az group create \
  --name pumping-lemma-rg \
  --location eastus
```

### 3. Deploy Infrastructure
```bash
az deployment group create \
  --name pumping-lemma-deploy \
  --resource-group pumping-lemma-rg \
  --template-file azure/deploy.json \
  --parameters appServicePlanSku=B1
```

### 4. Deploy the Application
After deployment, you'll get the App Service name. Deploy the Docker image:

```bash
# Create Azure Container Registry (optional but recommended)
az acr create \
  --resource-group pumping-lemma-rg \
  --name pumpinglemmaacr \
  --sku Basic

# Build and push Docker image
az acr build \
  --registry pumpinglemmaacr \
  --image pumping-lemma:latest .

# Configure App Service for Docker deployment
APP_SERVICE_NAME="pumping-lemma-viz-<unique-suffix>"
az webapp config container set \
  --name $APP_SERVICE_NAME \
  --resource-group pumping-lemma-rg \
  --docker-custom-image-name pumpinglemmaacr.azurecr.io/pumping-lemma:latest \
  --docker-registry-server-url https://pumpinglemmaacr.azurecr.io
```

## Local Testing with Docker

### Run with Docker Compose
```bash
docker-compose up --build
```

The app will be available at `http://localhost:8080`

### Run with Docker directly
```bash
docker build -t pumping-lemma-viz .
docker run -p 8080:80 pumping-lemma-viz
```

## Deployment Options

### Option 1: Azure App Service (Recommended)
- Easiest to set up
- Built-in scaling and monitoring
- Use the ARM template in `azure/deploy.json`

### Option 2: Azure Container Instances
```bash
az container create \
  --resource-group pumping-lemma-rg \
  --name pumping-lemma-container \
  --image pumpinglemmaacr.azurecr.io/pumping-lemma:latest \
  --ports 80 \
  --environment-variables \
    ASPNETCORE_URLS=http://+:80 \
  --registry-login-server pumpinglemmaacr.azurecr.io \
  --registry-username <username> \
  --registry-password <password>
```

### Option 3: Azure Kubernetes Service (AKS)
For production environments with high traffic. See `k8s-deployment.yaml` (if applicable).

## Monitoring & Logs

### View Application Logs
```bash
az webapp log tail --name $APP_SERVICE_NAME --resource-group pumping-lemma-rg
```

### Set Up Application Insights
```bash
az monitor app-insights component create \
  --app pumping-lemma-insights \
  --location eastus \
  --resource-group pumping-lemma-rg
```

## Environment Variables
- `NODE_ENV`: Set to `production`
- `PORT`: Default 80 (configured in nginx)

## Cleanup
```bash
az group delete --name pumping-lemma-rg --yes
```

## Support
For more information, visit:
- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Docker Documentation](https://docs.docker.com/)
