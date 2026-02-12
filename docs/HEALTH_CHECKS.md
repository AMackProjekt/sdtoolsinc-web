# System Health Checks

## Overview

The T.O.O.L.S Inc application includes comprehensive health check endpoints for monitoring system status and ensuring stability.

## Available Endpoints

### 1. Health Check (`/api/healthz`)

**Purpose:** Basic liveness check to verify the application is running.

**Endpoint:** `GET /api/healthz`

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Application is healthy and responding
- `5xx` - Application is experiencing issues

**Use Case:**
- Container orchestration health checks
- Load balancer health checks
- Simple uptime monitoring
- CI/CD pipeline verification

**Example Usage:**
```bash
# cURL
curl https://sdtoolsinc.org/api/healthz

# PowerShell
Invoke-RestMethod -Uri "https://sdtoolsinc.org/api/healthz"

# Azure Container Instance health probe
az container create \
  --resource-group myResourceGroup \
  --name mycontainer \
  --image myimage \
  --http-probe-path /api/healthz
```

### 2. Readiness Check (`/api/readyz`)

**Purpose:** Verify the application is ready to accept traffic (includes dependency checks).

**Endpoint:** `GET /api/readyz`

**Response:**
```json
{
  "status": "ready"
}
```

**Status Codes:**
- `200 OK` - Application is ready to serve traffic
- `503 Service Unavailable` - Application is not ready (dependencies unavailable)

**Future Enhancements:**
- Database connection check
- External API availability
- Cache service status
- File system access

**Use Case:**
- Kubernetes readiness probes
- Load balancer readiness checks
- Startup verification
- Post-deployment validation

**Example Usage:**
```bash
# Check if application is ready
curl https://sdtoolsinc.org/api/readyz

# Kubernetes readiness probe configuration
readinessProbe:
  httpGet:
    path: /api/readyz
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
```

## Implementation Details

### Health Check (`healthz`)

**File:** `api/src/functions/healthz/index.ts`

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok } from "../../shared/http";

export async function healthz(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("healthz check");
  return ok({ status: "ok" });
}

app.http("healthz", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "healthz",
  handler: healthz
});
```

### Readiness Check (`readyz`)

**File:** `api/src/functions/readyz/index.ts`

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok } from "../../shared/http";

export async function readyz(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Wire DB readiness checks later (Cosmos/SQL/Postgres)
  context.log("readyz check");
  return ok({ status: "ready" });
}

app.http("readyz", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "readyz",
  handler: readyz
});
```

## Monitoring and Alerting

### Azure Monitor Integration

The health check endpoints are logged in Azure Application Insights, providing:

- Request counts
- Response times
- Failure rates
- Availability metrics

**Query Examples (KQL):**

```kusto
// Health check success rate (last 24 hours)
requests
| where timestamp > ago(24h)
| where url contains "healthz" or url contains "readyz"
| summarize 
    Total = count(),
    Successful = countif(success == true),
    Failed = countif(success == false)
| extend SuccessRate = (Successful * 100.0) / Total

// Average response time for health checks
requests
| where timestamp > ago(1h)
| where url contains "healthz" or url contains "readyz"
| summarize avg(duration) by bin(timestamp, 5m), name

// Failed health checks
requests
| where timestamp > ago(1h)
| where url contains "healthz" or url contains "readyz"
| where success == false
| project timestamp, name, resultCode, duration
```

### Recommended Monitoring Setup

**1. Uptime Monitoring**
- Check `/api/healthz` every 1 minute
- Alert if 3 consecutive failures
- Alert if response time > 5 seconds

**2. Readiness Monitoring**
- Check `/api/readyz` every 5 minutes
- Alert if service unavailable for > 2 minutes
- Track readiness state changes

**3. Performance Tracking**
- Monitor response times
- Set baseline: < 100ms for health checks
- Alert if response time > 500ms

## Extending Health Checks

### Adding Database Health Check

Update `api/src/functions/readyz/index.ts`:

```typescript
import { pool } from "../../shared/database";

export async function readyz(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Check database connection
    const result = await pool.request().query('SELECT 1');
    
    if (!result) {
      return {
        status: 503,
        jsonBody: { status: "not_ready", reason: "database_unavailable" }
      };
    }
    
    context.log("readyz check: all systems ready");
    return ok({ 
      status: "ready",
      checks: {
        database: "ok"
      }
    });
  } catch (error) {
    context.error("readyz check failed:", error);
    return {
      status: 503,
      jsonBody: { 
        status: "not_ready", 
        reason: "database_error",
        error: error.message 
      }
    };
  }
}
```

### Adding External API Health Check

```typescript
export async function readyz(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const checks = {
    database: "ok",
    externalApi: "ok"
  };
  
  try {
    // Check external API
    const response = await fetch('https://external-api.com/health', {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      checks.externalApi = "degraded";
    }
  } catch (error) {
    checks.externalApi = "unavailable";
    context.warn("External API check failed:", error);
  }
  
  const allHealthy = Object.values(checks).every(status => status === "ok");
  
  return {
    status: allHealthy ? 200 : 503,
    jsonBody: { 
      status: allHealthy ? "ready" : "degraded",
      checks 
    }
  };
}
```

## Performance Metrics Endpoint (Future)

For detailed performance monitoring, consider adding a `/api/metrics` endpoint:

```typescript
export async function metrics(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV,
    version: process.env.APP_VERSION || "unknown",
    // Add custom application metrics
    stats: {
      activeConnections: 0, // Track your metrics
      requestCount: 0,
      errorRate: 0
    }
  };
  
  return ok(metrics);
}
```

## CI/CD Integration

### GitHub Actions Health Check

Add to `.github/workflows/azure-static-web-apps-*.yml`:

```yaml
- name: Verify Deployment Health
  run: |
    echo "Waiting for deployment to stabilize..."
    sleep 30
    
    # Check health endpoint
    HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://sdtoolsinc.org/api/healthz)
    
    if [ $HEALTH_STATUS -eq 200 ]; then
      echo "✅ Health check passed"
    else
      echo "❌ Health check failed with status: $HEALTH_STATUS"
      exit 1
    fi
    
    # Check readiness endpoint
    READY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://sdtoolsinc.org/api/readyz)
    
    if [ $READY_STATUS -eq 200 ]; then
      echo "✅ Readiness check passed"
    else
      echo "❌ Readiness check failed with status: $READY_STATUS"
      exit 1
    fi
```

### Docker Health Check

Add to `Dockerfile`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/healthz || exit 1
```

### Azure Container Instance

```bash
az container create \
  --resource-group myResourceGroup \
  --name toolsinc-web \
  --image myregistry.azurecr.io/toolsinc-web:latest \
  --dns-name-label toolsinc \
  --ports 80 443 \
  --cpu 1 \
  --memory 1.5 \
  --restart-policy OnFailure \
  --http-probe-path /api/healthz \
  --http-probe-port 3000 \
  --http-probe-interval-seconds 30 \
  --http-probe-timeout-seconds 3
```

## Best Practices

### 1. Keep Health Checks Simple
- Health checks should complete in < 100ms
- Avoid expensive operations (complex queries, external calls)
- Use separate endpoints for different check types

### 2. Return Appropriate Status Codes
- `200 OK` - Everything is healthy
- `503 Service Unavailable` - Service is down but will recover
- `500 Internal Server Error` - Unexpected error

### 3. Include Minimal Details
- Don't expose sensitive information
- Return structured JSON
- Include timestamp if needed

### 4. Log Health Check Activity
- Log failures with details
- Don't log every successful check (too noisy)
- Use appropriate log levels

### 5. Monitor Health Check Performance
- Track response times
- Alert on degradation
- Set up automated recovery

## Troubleshooting

### Health Check Always Returns 503

1. Check application logs for errors
2. Verify database connectivity
3. Check external dependencies
4. Review resource limits (CPU, memory)

### Health Check Times Out

1. Increase timeout values
2. Optimize health check queries
3. Check for deadlocks
4. Review network connectivity

### False Positive Health Checks

1. Add more thorough checks
2. Include dependency verification
3. Test actual functionality
4. Add smoke tests

## Resources

- [Azure Functions Health Checks](https://learn.microsoft.com/azure/azure-functions/functions-monitoring)
- [Kubernetes Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Health Check Best Practices](https://learn.microsoft.com/aspnet/core/host-and-deploy/health-checks)

## Contact

For questions about health monitoring:
- Email: info@sdtoolsinc.org
- GitHub Issues: [sdtoolsinc-web repository]
