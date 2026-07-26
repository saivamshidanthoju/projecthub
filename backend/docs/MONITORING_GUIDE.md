# Monitoring & Observability Guide - ProjectHub

We natively collect and expose structured logs and Prometheus metrics across all backend routes to provide real-time visibility into the system.

---

## 1. Metrics Endpoint

The application exposes Prometheus-compatible metrics on:
```
GET /metrics
```
This endpoint provides real-time counts of:
- **`http_requests_total`**: Count of HTTP operations (method, status code, route path parameters).
- **`http_request_duration_ms_sum` / `http_request_duration_ms_count`**: Average API call latency metrics.
- **`http_errors_total`**: HTTP error tracking statistics.
- **`db_queries_total`**: Database requests executed.
- **`socket_connections_active`**: Real-time active Socket.IO connections count.

---

## 2. Prometheus Scraping Configuration

Add this job configuration inside your `prometheus.yml` configuration:
```yaml
scrape_configs:
  - job_name: 'projecthub-backend'
    scrape_interval: 15s
    metrics_path: '/metrics'
    static_configs:
      - targets: ['localhost:5000']
```

---

## 3. Winston Structured JSON Logs

Our Winston logs output JSON format structured streams:
```json
{
  "timestamp": "2026-07-25 21:30:15",
  "level": "info",
  "message": "Project created successfully.",
  "requestId": "a6b7c8d9e0f1a2b3",
  "userId": 12,
  "organizationId": 1,
  "project_id": 4
}
```
Every request executes inside an `AsyncLocalStorage` transaction context, binding a unique `requestId` (correlation ID) to Winston. When parsing application errors in Logstash, Elasticsearch, or AWS CloudWatch Logs, you can query by `requestId` to inspect the full execution path across database queries and socket notifications.

---

## 4. Alerting Threshold Rules

Configure the following thresholds in Grafana or Prometheus Alertmanager:
1. **Server Down Alert**: Trigger if `up == 0` for 1 minute.
2. **High Latency Alert**: Trigger if HTTP request duration average exceeds 500ms.
3. **Error Spike Alert**: Trigger if error rate spikes (`http_errors_total` rate > 5% of requests).
