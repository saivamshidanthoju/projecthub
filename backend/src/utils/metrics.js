const metrics = {
    requestCount: new Map(), // key: "method:route:status" -> count
    requestDuration: new Map(), // key: "method:route" -> { count, sum }
    errorCount: new Map(), // key: "method:route:status" -> count
    socketConnections: 0,
    dbQueries: 0
};

const incrementRequest = (method, route, status) => {
    const key = `${method}:${route}:${status}`;
    metrics.requestCount.set(key, (metrics.requestCount.get(key) || 0) + 1);
};

const recordDuration = (method, route, durationMs) => {
    const key = `${method}:${route}`;
    const current = metrics.requestDuration.get(key) || { count: 0, sum: 0 };
    current.count += 1;
    current.sum += durationMs;
    metrics.requestDuration.set(key, current);
};

const incrementError = (method, route, status) => {
    const key = `${method}:${route}:${status}`;
    metrics.errorCount.set(key, (metrics.errorCount.get(key) || 0) + 1);
};

const incrementDbQuery = () => {
    metrics.dbQueries += 1;
};

const setSocketConnections = (count) => {
    metrics.socketConnections = count;
};

const formatPrometheus = () => {
    let output = "";

    // HTTP Request Count
    output += "# HELP http_requests_total Total number of HTTP requests\n";
    output += "# TYPE http_requests_total counter\n";
    for (const [key, count] of metrics.requestCount) {
        const [method, route, status] = key.split(":");
        output += `http_requests_total{method="${method}",route="${route}",status="${status}"} ${count}\n`;
    }

    // HTTP Request Latency Sum
    output += "\n# HELP http_request_duration_ms Total request duration in ms\n";
    output += "# TYPE http_request_duration_ms summary\n";
    for (const [key, val] of metrics.requestDuration) {
        const [method, route] = key.split(":");
        output += `http_request_duration_ms_sum{method="${method}",route="${route}"} ${val.sum}\n`;
        output += `http_request_duration_ms_count{method="${method}",route="${route}"} ${val.count}\n`;
    }

    // HTTP Error Count
    output += "\n# HELP http_errors_total Total number of HTTP request errors\n";
    output += "# TYPE http_errors_total counter\n";
    for (const [key, count] of metrics.errorCount) {
        const [method, route, status] = key.split(":");
        output += `http_errors_total{method="${method}",route="${route}",status="${status}"} ${count}\n`;
    }

    // DB Queries Count
    output += `\n# HELP db_queries_total Total number of Database queries executed\n`;
    output += `# TYPE db_queries_total counter\n`;
    output += `db_queries_total ${metrics.dbQueries}\n`;

    // Socket Active Connections
    output += `\n# HELP socket_connections_active Number of active Socket.IO connections\n`;
    output += `# TYPE socket_connections_active gauge\n`;
    output += `socket_connections_active ${metrics.socketConnections}\n`;

    return output;
};

module.exports = {
    incrementRequest,
    recordDuration,
    incrementError,
    incrementDbQuery,
    setSocketConnections,
    formatPrometheus,
    metrics
};
