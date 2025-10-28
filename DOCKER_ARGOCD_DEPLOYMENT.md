# 🚀 DockerHub + ArgoCD Deployment Guide

## 📦 **STEP 1: Push to DockerHub**

### **1.1 Login to DockerHub**
```bash
docker login
# Enter your DockerHub username and password
```

### **1.2 Build Your Image**
```bash
cd /path/to/weather-app

# Build the image
docker build -t YOUR_DOCKERHUB_USERNAME/cloudvibes-weather:latest .

# Example:
docker build -t johndoe/cloudvibes-weather:latest .
```

### **1.3 Push to DockerHub**
```bash
docker push YOUR_DOCKERHUB_USERNAME/cloudvibes-weather:latest

# Example:
docker push johndoe/cloudvibes-weather:latest
```

### **1.4 Tag with Version (Optional but Recommended)**
```bash
# Tag with version
docker tag YOUR_DOCKERHUB_USERNAME/cloudvibes-weather:latest \
            YOUR_DOCKERHUB_USERNAME/cloudvibes-weather:v1.0.0

# Push version
docker push YOUR_DOCKERHUB_USERNAME/cloudvibes-weather:v1.0.0
```

---

## 📝 **STEP 2: Update Kubernetes Manifests**

### **2.1 Update deployment.yaml**
Edit `k8s/deployment.yaml` line 18:

**Change:**
```yaml
image: YOUR_DOCKERHUB_USERNAME/cloudvibes-weather:latest
```

**To:**
```yaml
image: johndoe/cloudvibes-weather:latest  # Your actual DockerHub username
```

### **2.2 Update Ingress Domain (if needed)**
Edit `k8s/ingress.yaml` lines 13-14 and 17, 23:

Make sure domains match your actual domain (already set to cloudvibes.org)

---

## 🔄 **STEP 3: Push to GitHub**

### **3.1 Initialize Git (if not already)**
```bash
cd /path/to/weather-app

git init
git add .
git commit -m "Initial commit: CloudVibes Weather App with AdSense"
```

### **3.2 Create GitHub Repository**
1. Go to https://github.com/new
2. Repository name: `cloudvibes-weather`
3. Privacy: Public or Private
4. Don't initialize with README (you already have files)
5. Click **Create repository**

### **3.3 Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/cloudvibes-weather.git
git branch -M main
git push -u origin main
```

---

## ⚙️ **STEP 4: Setup ArgoCD**

### **4.1 Install ArgoCD (if not installed)**
```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
kubectl wait --for=condition=available --timeout=300s \
  deployment/argocd-server -n argocd
```

### **4.2 Access ArgoCD UI**
```bash
# Port forward ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# Open browser: https://localhost:8080
# Username: admin
# Password: (from command above)
```

### **4.3 Install ArgoCD CLI (Optional)**
```bash
# macOS
brew install argocd

# Linux
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
```

---

## 🚀 **STEP 5: Deploy with ArgoCD**

### **5.1 Update ArgoCD Application YAML**
Edit `argocd/application.yaml` line 8:

**Change:**
```yaml
repoURL: https://github.com/YOUR_USERNAME/cloudvibes-weather.git
```

**To:**
```yaml
repoURL: https://github.com/johndoe/cloudvibes-weather.git  # Your GitHub username
```

### **5.2 Create Application via kubectl**
```bash
kubectl apply -f argocd/application.yaml
```

### **5.3 OR Create via ArgoCD UI**
1. Open ArgoCD UI: https://localhost:8080
2. Click **+ NEW APP**
3. Fill in:
   - **Application Name:** cloudvibes-weather
   - **Project:** default
   - **Sync Policy:** Automatic
   - **Repository URL:** https://github.com/YOUR_USERNAME/cloudvibes-weather.git
   - **Path:** k8s
   - **Cluster:** https://kubernetes.default.svc
   - **Namespace:** cloudvibes
4. Click **CREATE**

### **5.4 OR Create via ArgoCD CLI**
```bash
# Login to ArgoCD
argocd login localhost:8080

# Create application
argocd app create cloudvibes-weather \
  --repo https://github.com/YOUR_USERNAME/cloudvibes-weather.git \
  --path k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace cloudvibes \
  --sync-policy automated \
  --auto-prune \
  --self-heal
```

---

## ✅ **STEP 6: Verify Deployment**

### **6.1 Check ArgoCD Application Status**
```bash
# Via CLI
argocd app get cloudvibes-weather

# Via kubectl
kubectl get application -n argocd cloudvibes-weather

# Check sync status
argocd app sync cloudvibes-weather
```

### **6.2 Check Kubernetes Resources**
```bash
# Check namespace
kubectl get ns cloudvibes

# Check pods
kubectl get pods -n cloudvibes

# Check deployment
kubectl get deployment -n cloudvibes

# Check service
kubectl get svc -n cloudvibes

# Check ingress
kubectl get ingress -n cloudvibes

# View logs
kubectl logs -n cloudvibes -l app=cloudvibes-weather --tail=50 -f
```

### **6.3 Test Application**
```bash
# Get ingress IP (if using LoadBalancer)
kubectl get ingress -n cloudvibes cloudvibes-weather

# Test locally (port forward)
kubectl port-forward -n cloudvibes svc/cloudvibes-weather 3000:80

# Open browser: http://localhost:3000
```

---

## 🌐 **STEP 7: Configure DNS**

### **7.1 Get External IP**
```bash
# If using LoadBalancer
kubectl get svc -n ingress-nginx ingress-nginx-controller

# Or get ingress address
kubectl get ingress -n cloudvibes cloudvibes-weather
```

### **7.2 Update DNS Records**
Go to your DNS provider (Cloudflare, Route53, etc.):

**Create A Records:**
- **Name:** @ (root)
- **Type:** A
- **Value:** YOUR_INGRESS_IP
- **TTL:** 300

- **Name:** www
- **Type:** A
- **Value:** YOUR_INGRESS_IP
- **TTL:** 300

### **7.3 Wait for DNS Propagation**
```bash
# Check DNS
dig cloudvibes.org
dig www.cloudvibes.org

# Or use online tool
https://www.whatsmydns.net/#A/cloudvibes.org
```

---

## 🔒 **STEP 8: Setup SSL Certificate**

### **8.1 Install Cert-Manager (if not installed)**
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for cert-manager
kubectl wait --for=condition=available --timeout=300s \
  deployment/cert-manager -n cert-manager
```

### **8.2 Create Let's Encrypt Issuer**
```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: YOUR_EMAIL@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### **8.3 Verify Certificate**
```bash
# Check certificate
kubectl get certificate -n cloudvibes

# Check certificate details
kubectl describe certificate -n cloudvibes cloudvibes-tls

# Check if ready
kubectl get certificate -n cloudvibes cloudvibes-tls -o jsonpath='{.status.conditions[?(@.type=="Ready")].status}'
```

---

## 🔄 **STEP 9: CI/CD Pipeline (Automated Updates)**

### **9.1 Create GitHub Actions Workflow**
Create `.github/workflows/deploy.yaml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          ${{ secrets.DOCKERHUB_USERNAME }}/cloudvibes-weather:latest
          ${{ secrets.DOCKERHUB_USERNAME }}/cloudvibes-weather:${{ github.sha }}

    - name: Update deployment
      run: |
        sed -i "s|image:.*|image: ${{ secrets.DOCKERHUB_USERNAME }}/cloudvibes-weather:${{ github.sha }}|" k8s/deployment.yaml
        git config user.name "GitHub Actions"
        git config user.email "actions@github.com"
        git add k8s/deployment.yaml
        git commit -m "Update image to ${{ github.sha }}"
        git push
```

### **9.2 Add GitHub Secrets**
Go to GitHub → Settings → Secrets → Actions:

- **DOCKERHUB_USERNAME:** Your DockerHub username
- **DOCKERHUB_TOKEN:** DockerHub access token (create at hub.docker.com/settings/security)

---

## 📊 **STEP 10: Monitoring & Troubleshooting**

### **10.1 Check Application Logs**
```bash
# Real-time logs
kubectl logs -n cloudvibes -l app=cloudvibes-weather -f

# Last 100 lines
kubectl logs -n cloudvibes -l app=cloudvibes-weather --tail=100

# Previous container logs (if crashed)
kubectl logs -n cloudvibes -l app=cloudvibes-weather --previous
```

### **10.2 Check Pod Status**
```bash
# Describe pod
kubectl describe pod -n cloudvibes -l app=cloudvibes-weather

# Get pod events
kubectl get events -n cloudvibes --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods -n cloudvibes
```

### **10.3 Common Issues**

**Issue: Pods not starting**
```bash
# Check pod events
kubectl describe pod -n cloudvibes -l app=cloudvibes-weather

# Common causes:
# - Image pull error (check DockerHub image exists)
# - Resource limits too low
# - Port already in use
```

**Issue: Can't access via domain**
```bash
# Check ingress
kubectl get ingress -n cloudvibes
kubectl describe ingress -n cloudvibes cloudvibes-weather

# Check ingress controller
kubectl get pods -n ingress-nginx

# Check DNS
dig cloudvibes.org
```

**Issue: Certificate not ready**
```bash
# Check certificate status
kubectl describe certificate -n cloudvibes cloudvibes-tls

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Delete and recreate certificate
kubectl delete certificate -n cloudvibes cloudvibes-tls
# ArgoCD will recreate it automatically
```

---

## 🎯 **QUICK DEPLOYMENT CHECKLIST**

- [ ] Build Docker image
- [ ] Push to DockerHub
- [ ] Update `k8s/deployment.yaml` with your image
- [ ] Push code to GitHub
- [ ] Update `argocd/application.yaml` with your GitHub URL
- [ ] Apply ArgoCD application
- [ ] Wait for sync (check ArgoCD UI)
- [ ] Verify pods are running
- [ ] Configure DNS A records
- [ ] Wait for SSL certificate
- [ ] Test https://cloudvibes.org
- [ ] Check AdSense ads showing
- [ ] Monitor logs for errors

---

## 🚀 **QUICK START COMMANDS**

```bash
# 1. Build and push
docker build -t YOUR_USERNAME/cloudvibes-weather:latest .
docker push YOUR_USERNAME/cloudvibes-weather:latest

# 2. Update manifests (edit files with your username)
# Edit k8s/deployment.yaml line 18
# Edit argocd/application.yaml line 8

# 3. Push to GitHub
git add .
git commit -m "Deploy CloudVibes Weather"
git push

# 4. Deploy with ArgoCD
kubectl apply -f argocd/application.yaml

# 5. Watch deployment
kubectl get pods -n cloudvibes -w

# 6. Check application
kubectl get ingress -n cloudvibes
```

---

## 💡 **Pro Tips**

1. **Use image tags with versions** instead of `:latest` for better tracking
2. **Set up GitHub Actions** for automatic deployments on push
3. **Monitor ArgoCD UI** for sync status
4. **Use kubectl port-forward** for local testing before DNS
5. **Check logs immediately** after deployment
6. **Set up alerts** for pod crashes or high resource usage

---

## 🎉 **YOU'RE READY!**

Your CloudVibes weather app will now:
- ✅ Build automatically on push
- ✅ Deploy via ArgoCD
- ✅ Scale to 2 replicas for high availability
- ✅ Use SSL certificates
- ✅ Serve ads and make money! 💰

**Next:** Follow the steps and deploy to production! 🚀
