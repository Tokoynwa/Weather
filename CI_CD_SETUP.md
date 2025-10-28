# CI/CD Setup Guide - CloudVibes Weather

## Overview
This project uses **GitHub Actions** for Continuous Integration (building Docker images) and **ArgoCD** for Continuous Deployment (deploying to Kubernetes).

## Architecture

```
Code Push → GitHub → GitHub Actions → Build Docker Image → Push to GHCR → ArgoCD Syncs → Kubernetes Deploys
```

## Components

### 1. GitHub Actions (CI)
- **File**: `.github/workflows/docker-build.yml`
- **Triggers**: Push to `main` branch or Pull Requests
- **Actions**:
  - Builds Docker image from Dockerfile
  - Pushes to GitHub Container Registry (ghcr.io)
  - Tags: `latest`, `main-<sha>`, branch names

### 2. GitHub Container Registry (GHCR)
- **Registry**: `ghcr.io`
- **Image**: `ghcr.io/tokoynwa/cloudvibes-weather:latest`
- **Authentication**: Automatic via `GITHUB_TOKEN`

### 3. ArgoCD (CD)
- **File**: `argocd/application.yaml`
- **Source**: GitHub repository `https://github.com/Tokoynwa/Weather.git`
- **Path**: `k8s/` directory
- **Auto-Sync**: Enabled (prune, selfHeal)
- **Namespace**: `cloudvibes`

### 4. Kubernetes Manifests
- **deployment.yaml**: 2 replicas, resource limits, health checks
- **service.yaml**: ClusterIP service on port 80
- **ingress.yaml**: External access configuration

## Setup Instructions

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

### Step 2: Verify GitHub Actions
1. Go to https://github.com/Tokoynwa/Weather/actions
2. Watch the workflow build and push the Docker image
3. Verify image at https://github.com/Tokoynwa/Weather/pkgs/container/cloudvibes-weather

### Step 3: Make Repository Public (or Configure Image Pull Secret)

**Option A: Make Container Image Public (Recommended for public projects)**
1. Go to https://github.com/users/Tokoynwa/packages/container/cloudvibes-weather/settings
2. Scroll to "Danger Zone"
3. Click "Change visibility" → Select "Public"

**Option B: Create Image Pull Secret (For private repositories)**
```bash
# Create GitHub Personal Access Token with read:packages scope
# Then create secret in Kubernetes:
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=Tokoynwa \
  --docker-password=<YOUR_PAT> \
  --docker-email=<YOUR_EMAIL> \
  -n cloudvibes

# Update deployment.yaml to use the secret:
# spec:
#   template:
#     spec:
#       imagePullSecrets:
#       - name: ghcr-secret
```

### Step 4: Deploy ArgoCD Application
```bash
# Apply ArgoCD application
kubectl apply -f argocd/application.yaml

# Check ArgoCD app status
kubectl get applications -n argocd

# Watch sync progress
kubectl get pods -n cloudvibes -w
```

### Step 5: Verify Deployment
```bash
# Check pods
kubectl get pods -n cloudvibes

# Check service
kubectl get svc -n cloudvibes

# Check ingress
kubectl get ingress -n cloudvibes

# View logs
kubectl logs -n cloudvibes -l app=cloudvibes-weather
```

## Workflow

### Making Changes
1. **Edit code locally**
2. **Commit and push to GitHub**
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```
3. **GitHub Actions automatically**:
   - Builds new Docker image
   - Pushes to ghcr.io with `latest` tag
4. **ArgoCD automatically** (within 3 minutes):
   - Detects new image
   - Updates Kubernetes deployment
   - Rolls out new pods

### Manual Sync (if needed)
```bash
# Using ArgoCD CLI
argocd app sync cloudvibes-weather

# Or via kubectl
kubectl patch application cloudvibes-weather -n argocd -p '{"metadata":{"annotations":{"argocd.argoproj.io/refresh":"hard"}}}' --type merge
```

## Monitoring

### View ArgoCD Dashboard
```bash
# Port-forward ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access at: https://localhost:8080
# Username: admin
# Get password:
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
```

### View Application Logs
```bash
kubectl logs -n cloudvibes -l app=cloudvibes-weather --tail=100 -f
```

### Check Image Being Used
```bash
kubectl describe deployment cloudvibes-weather -n cloudvibes | grep Image
```

## Troubleshooting

### Image Pull Errors
If you see `ImagePullBackOff`:
1. Verify image exists: `docker pull ghcr.io/tokoynwa/cloudvibes-weather:latest`
2. Check if image is public or add imagePullSecret
3. Verify image name in deployment.yaml matches exactly

### ArgoCD Not Syncing
```bash
# Check application health
kubectl describe application cloudvibes-weather -n argocd

# Force refresh
argocd app get cloudvibes-weather --refresh
```

### Build Failures
1. Check GitHub Actions logs: https://github.com/Tokoynwa/Weather/actions
2. Verify Dockerfile syntax
3. Ensure all files are committed

## Best Practices

✅ **DO**:
- Always test Docker builds locally before pushing
- Use semantic versioning tags for production
- Monitor ArgoCD sync status
- Review logs after deployments
- Keep secrets in Kubernetes Secrets, not in code

❌ **DON'T**:
- Don't commit sensitive data (API keys, passwords)
- Don't skip testing the Docker image locally
- Don't use `imagePullPolicy: IfNotPresent` with `latest` tag (always use `Always`)
- Don't make manual kubectl changes (let ArgoCD manage)

## Image Tags Strategy

Current: Using `latest` tag (simple, auto-updates)

**For production, consider**:
```yaml
# deployment.yaml
image: ghcr.io/tokoynwa/cloudvibes-weather:v1.0.0

# Update workflow to create version tags:
# git tag v1.0.0
# git push origin v1.0.0
```

## Summary

**GitHub Actions** = Builds & pushes Docker images
**ArgoCD** = Deploys to Kubernetes
**Flow**: Code → Build → Registry → Deploy
**Speed**: ~2-5 minutes from push to deployment
