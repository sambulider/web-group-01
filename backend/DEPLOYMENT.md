# Production Deployment Guide

Complete guide for deploying the American Corner Management System backend to production.

## Pre-deployment Checklist

- [ ] Production database created (Supabase or PostgreSQL)
- [ ] Environment variables configured
- [ ] SECRET_KEY generated and stored securely
- [ ] CORS origins configured
- [ ] HTTPS certificate ready
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Security scanning completed
- [ ] Load testing passed
- [ ] Team trained on deployment procedures

## Option 1: Vercel (Recommended for FastAPI + Serverless)

### Step 1: Prepare Repository

```bash
# Ensure code is in git repository
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create Vercel Account

1. Go to vercel.com
2. Sign up/Log in
3. Import repository

### Step 3: Configure Environment

In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
SECRET_KEY=your-secret-key
ENVIRONMENT=production
DEBUG=false
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### Step 4: Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## Option 2: AWS (EC2 + RDS + Application Load Balancer)

### Step 1: Create RDS Database

1. AWS Console → RDS → Create Database
2. Engine: PostgreSQL 13+
3. Storage: 20GB (auto-scale enabled)
4. Multi-AZ: Enabled
5. Backup retention: 30 days
6. Get endpoint and credentials

### Step 2: Launch EC2 Instance

```bash
# AMI: Ubuntu 22.04 LTS
# Instance: t3.medium (for small/medium load)
# Storage: 30GB gp3
# Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
```

### Step 3: SSH into Instance

```bash
ssh -i "your-key.pem" ubuntu@your-instance-ip
```

### Step 4: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and pip
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install -y docker-compose

# Add ubuntu user to docker group
sudo usermod -aG docker $USER
```

### Step 5: Clone Repository

```bash
git clone https://github.com/your-org/american-corner-backend.git
cd american-corner-backend
```

### Step 6: Configure Environment

```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

### Step 7: Setup Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/default
```

**Nginx Configuration:**

```nginx
upstream api {
    server localhost:8000;
    keepalive 32;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 10M;

    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=200 nodelay;

    # Health check
    location /health {
        proxy_pass http://api;
        access_log off;
    }
}
```

### Step 8: Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d api.yourdomain.com
```

### Step 9: Start Services

```bash
# Start Docker container
docker build -t american-corner-api .
docker run -d \
  --name american-corner-api \
  --env-file .env \
  -p 127.0.0.1:8000:8000 \
  american-corner-api

# Or use docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 10: Run Migrations

```bash
docker-compose exec backend alembic upgrade head
```

---

## Option 3: Heroku (Deprecated, but still supported)

Heroku is deprecating free dynos. Use Vercel or AWS instead.

---

## Option 4: DigitalOcean App Platform

### Step 1: Create App

1. DigitalOcean → App Platform → Create App
2. Connect GitHub repository
3. Configure build settings

### Step 2: Set Environment Variables

```
DATABASE_URL=postgresql://...
SECRET_KEY=...
ENVIRONMENT=production
```

### Step 3: Configure Database

1. Create PostgreSQL database
2. Update DATABASE_URL with connection string
3. Enable automatic backups

### Step 4: Deploy

Automatically deployed on git push.

---

## Post-deployment Configuration

### 1. Setup Monitoring

#### DataDog
```bash
pip install datadog
```

#### Prometheus
```bash
# Install Prometheus exporter
pip install prometheus-client
```

### 2. Configure Logging

```env
LOG_LEVEL=INFO
LOG_FORMAT=json
```

### 3. Setup Backups

```bash
# Daily backup (cron job)
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

### 4. Configure Alerts

Setup alerts for:
- High error rate (>5% errors)
- High response time (>2s)
- Database connectivity issues
- Disk space low
- Memory usage high

### 5. Health Checks

```bash
# Setup monitoring endpoint
curl https://api.yourdomain.com/health
```

---

## Scaling Strategy

### Horizontal Scaling

```yaml
# docker-compose.prod.yml with multiple instances
services:
  backend-1:
    build: .
    ports:
      - "8001:8000"
  
  backend-2:
    build: .
    ports:
      - "8002:8000"
  
  backend-3:
    build: .
    ports:
      - "8003:8000"

  nginx:
    # Routes traffic to all backends
```

### Vertical Scaling

- Increase container resources
- Increase database resources
- Implement caching (Redis)
- Database query optimization

### Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test endpoint
ab -n 1000 -c 100 https://api.yourdomain.com/health
```

---

## Troubleshooting

### Container won't start

```bash
docker logs american-corner-api
docker inspect american-corner-api
```

### Database connection issues

```bash
psql $DATABASE_URL -c "SELECT 1"
```

### High memory usage

```bash
docker stats american-corner-api
docker ps --size
```

### Certificate renewal

```bash
sudo certbot renew --dry-run
sudo certbot renew  # Automatic with nginx plugin
```

---

## Maintenance

### Regular Tasks

```bash
# Weekly: Check logs and metrics
# Monthly: Review performance and costs
# Quarterly: Security scanning
# Annually: Disaster recovery testing

# Database maintenance
sudo -u postgres vacuum full;
sudo -u postgres analyze;
```

### Security Patches

```bash
# Check for outdated packages
pip list --outdated

# Update requirements
pip install --upgrade -r requirements.txt
# Test thoroughly before deploying
```

### Backup Verification

```bash
# Test restore process monthly
psql $DATABASE_URL < /backups/db-latest.sql
```

---

## Disaster Recovery

### Backup Strategy

- Automated daily backups to S3/Backblaze
- 30-day retention
- Monthly manual full backups to separate storage
- Quarterly disaster recovery testing

### Recovery Procedures

```bash
# Quick restore from most recent backup
psql $DATABASE_URL < latest-backup.sql

# Point-in-time recovery
psql $DATABASE_URL < backup-from-date.sql
```

### DNS Failover

- Maintain standby instance
- Use health checks to auto-failover
- Setup CDN for static content

---

## Performance Optimization

### Database
- Analyze query performance: `EXPLAIN ANALYZE`
- Add indexes for frequent queries
- Archive old data
- Connection pooling with pgBouncer

### Application
- Enable caching (Redis)
- Compress API responses (gzip)
- Async processing with Celery
- CDN for static assets

### Infrastructure
- Use CDN (Cloudflare, AWS CloudFront)
- Enable HTTP/2
- Setup caching headers
- Use connection multiplexing

---

## Cost Optimization

### Estimate Monthly Costs

- EC2 t3.medium: ~$32/month
- RDS PostgreSQL: ~$50/month
- Data transfer: ~$10/month
- **Total: ~$92/month**

### Ways to Reduce Costs

- Use Fargate for serverless containers
- Switch to t2.small during low traffic
- Use Aurora Serverless for database
- Archive old data
- Use managed backups instead of custom

---

## Success Metrics

Track these after deployment:

- API response time: < 200ms
- Error rate: < 0.1%
- Uptime: > 99.9%
- Database CPU: < 70%
- Memory usage: < 80%

---

## Support

For deployment issues:
1. Check cloud provider docs
2. Review application logs
3. Check database connectivity
4. Test with Swagger UI
5. Contact: team@americancornerbatti.lk

---

## References

- [AWS Deployment](https://aws.amazon.com/getting-started/)
- [Vercel Deployment](https://vercel.com/docs)
- [DigitalOcean Deployment](https://www.digitalocean.com/docs)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
