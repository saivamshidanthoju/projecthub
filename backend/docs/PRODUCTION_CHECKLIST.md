# Production Deployment Checklist - ProjectHub Backend

Ensure all steps in this checklist are verified before deploying the ProjectHub backend engine.

---

## 1. Environment & Config
- [ ] **Node Environment**: Set `NODE_ENV=production`. This disables verbose error logs and stack leaks.
- [ ] **Secrets Keys**: Generate a strong crypto-random key (at least 256 bits) for `JWT_SECRET`. Do not use placeholders.
- [ ] **CORS Settings**: Restrict `CORS_ORIGIN` to your official frontend domain instead of `*`.
- [ ] **Port Settings**: Bind to standard secure port or configure reverse proxy (like Nginx) handling incoming port 80/443 mapping.

---

## 2. Security Configuration
- [ ] **Security Headers**: Helmet middleware is active, but check content-security policies (CSP) if hosting static content.
- [ ] **SSL/TLS**: Enforce HTTPS connections. Obtain SSL certificates (e.g. from Let's Encrypt) and run SSL test scoring (aim for A+).
- [ ] **IP Rate Limits**: Verify default limiter limits are active on all public entry points.
- [ ] **Traversal Safeguards**: Verify that file attachments resolve paths inside `/uploads` boundary.

---

## 3. Database Hardening
- [ ] **User Role Permissions**: Restrict database user rights (the backend pool should connect via a user possessing only DML/DDL access, avoiding root superuser access).
- [ ] **Connection Pooling**: Adjust pg pool size limits according to your production system capacity.
- [ ] **Automated Backups**: Enable PG dumping routines on a cron structure:
  ```bash
  pg_dump -U postgres -d projecthub -F c -b -v -f "/backups/projecthub_backup_$(date +%F).dump"
  ```
- [ ] **Indices Validation**: Run schema migrations and verify that custom indexing is applied to all foreign keys (`organization_id`, `project_id`, `task_id`).

---

## 4. Storage Setup
- [ ] **Directory Permissions**: Ensure read/write access to the `/uploads` directory is restricted to the Node runtime runner.
- [ ] **Cloud Migration**: For high availability (HA) horizontal scaling, replace local uploads storage with AWS S3 provider storage as outlined in our S3 migration plan.

---

## 5. Monitoring & Scaling
- [ ] **Process Management**: Configure PM2 or Docker cluster mode to run processes in target multi-core environments, enabling auto-restart on system crashes:
  ```bash
  pm2 start src/server.js --name projecthub-backend -i max
  ```
- [ ] **Health Monitoring**: Hook health metrics (`/api/health`) into automated alert monitors (like Pingdom, AWS CloudWatch, Datadog) to alert operations on db or socket crashes.
- [ ] **Logs Rotation**: Verify Winston rotators clean logs older than 14 days to preserve disk space.
