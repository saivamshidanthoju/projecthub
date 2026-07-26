# Rollback Operations Guide - ProjectHub

If a release deployment fails health check probes on AWS, execute the following steps to immediately restore system operations.

---

## 1. Automated Rollbacks (GitHub Actions)

In our `.github/workflows/ci-cd.yml` workflow, deployments verify state:
```bash
if docker-compose up -d backend; then
    echo "🎉 Deployment successful."
else
    echo "⚠️ Deployment failed. Initiating rollback..."
    docker-compose rollback backend || docker rollback backend
    exit 1
fi
```
If the container crashes or fails to start, the runner rolls back to the previous tag.

---

## 2. Manual Container Rollback

If you detect post-release errors (e.g. log metrics show high error rates), execute a manual rollback:

1. **Find target stable Docker image tag**:
   Visit GitHub Container Registry (GHCR) package page and copy the previous tag name (e.g., `sha-a1b2c3d` or `latest` from previous run).
2. **SSH to EC2 server**:
   ```bash
   ssh -i deploy_key.pem ubuntu@your-ec2-ip
   ```
3. **Edit `docker-compose.yml` tag**:
   Update backend image to the previous tag:
   ```yaml
   image: ghcr.io/your-username/projecthub-backend:sha-a1b2c3d
   ```
4. **Deploy old container**:
   ```bash
   docker-compose pull backend
   docker-compose up -d backend
   ```
5. **Verify live probes**:
   ```bash
   curl http://localhost:5000/ready
   ```

---

## 3. Database State Rollback

If the release included schema updates that caused failures, restore the PostgreSQL state using your RDS automated snapshots or S3 dump backups:

1. **Fetch backup dump**:
   ```bash
   aws s3 cp s3://projecthub-db-backups/projecthub_backup_YYYY-MM-DD_HH-MM-SS.sql.gz .
   gunzip projecthub_backup_YYYY-MM-DD_HH-MM-SS.sql.gz
   ```
2. **Re-create DB and restore**:
   ```bash
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d postgres -c "DROP DATABASE projecthub;"
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d postgres -c "CREATE DATABASE projecthub;"
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d projecthub -f projecthub_backup_YYYY-MM-DD_HH-MM-SS.sql
   ```
3. **Verify backend connection recovery**:
   ```bash
   curl http://localhost:5000/health
   ```
