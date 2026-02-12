import "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || process.env.GATEWAY_PORT || 4000;

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet());

// CORS - allow admin frontend
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://admin.asagus.com",
      "https://asagus.com",
      "https://www.asagus.com",
      "https://api.asagus.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  })
);

// Logging
app.use(morgan("combined"));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: { success: false, error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// IMPORTANT: Do NOT use express.json() here globally!
// Body parsing MUST be skipped for proxied routes, otherwise the request
// stream is consumed and http-proxy-middleware hangs waiting for body data
// that will never come. Body parsing is only needed for non-proxied routes
// (health checks, 404 handler) - those don't send bodies anyway.

// ============================================
// Health Check
// ============================================

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "api-gateway",
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/v1/health", (_req, res) => {
  res.json({
    success: true,
    services: {
      gateway: "healthy",
      auth: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
      content: process.env.CONTENT_SERVICE_URL || "http://localhost:4002",
      analytics: process.env.ANALYTICS_SERVICE_URL || "http://localhost:4003",
    },
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Service Proxies
// ============================================
// IMPORTANT: We use pathFilter instead of Express mount paths (app.use("/path", ...))
// because Express strips the mount prefix from req.url. For example,
// app.use("/api/v1/auth", proxy) makes req.url = "/login" for a request to
// /api/v1/auth/login. The upstream auth service expects the FULL path
// /api/v1/auth/login, so the stripped URL causes a 404.
// Using pathFilter, http-proxy-middleware filters requests itself without
// stripping the path, preserving the full URL for the upstream service.

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:4001";
const CONTENT_SERVICE = process.env.CONTENT_SERVICE_URL || "http://localhost:4002";
const ANALYTICS_SERVICE = process.env.ANALYTICS_SERVICE_URL || "http://localhost:4003";

// Auth Service Proxy
app.use(
  createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/auth",
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Auth service error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Auth service unavailable",
        });
      },
    },
  })
);

// Content Service Proxy
app.use(
  createProxyMiddleware({
    target: CONTENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/content",
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Content service error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Content service unavailable",
        });
      },
    },
  })
);

// Projects Proxy - redirect to content service
app.use(
  createProxyMiddleware({
    target: CONTENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/projects",
    pathRewrite: { "^/api/v1/projects": "/api/v1/content/projects" },
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Projects error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Projects service unavailable",
        });
      },
    },
  })
);

// Services Proxy - redirect to content service
app.use(
  createProxyMiddleware({
    target: CONTENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/services",
    pathRewrite: { "^/api/v1/services": "/api/v1/content/services" },
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Services error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Services unavailable",
        });
      },
    },
  })
);

// Testimonials Proxy - redirect to content service
app.use(
  createProxyMiddleware({
    target: CONTENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/testimonials",
    pathRewrite: { "^/api/v1/testimonials": "/api/v1/content/testimonials" },
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Testimonials error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Testimonials service unavailable",
        });
      },
    },
  })
);

// FAQs Proxy - redirect to content service
app.use(
  createProxyMiddleware({
    target: CONTENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/faqs",
    pathRewrite: { "^/api/v1/faqs": "/api/v1/content/faqs" },
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] FAQs error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "FAQs service unavailable",
        });
      },
    },
  })
);

// Contacts Proxy - redirect to content service
app.use(
  createProxyMiddleware({
    target: CONTENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/contacts",
    pathRewrite: { "^/api/v1/contacts": "/api/v1/content/contacts" },
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Contacts error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Contacts service unavailable",
        });
      },
    },
  })
);

// Analytics Service Proxy
app.use(
  createProxyMiddleware({
    target: ANALYTICS_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/analytics",
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Analytics service error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Analytics service unavailable",
        });
      },
    },
  })
);

// Dashboard aggregate endpoint
app.use(
  createProxyMiddleware({
    target: CONTENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/dashboard",
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Dashboard error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Dashboard service unavailable",
        });
      },
    },
  })
);

// Settings Proxy
app.use(
  createProxyMiddleware({
    target: CONTENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/v1/settings",
    on: {
      error: (err, _req, res) => {
        console.error("[Gateway] Settings error:", err.message);
        (res as express.Response).status(502).json({
          success: false,
          error: "Settings service unavailable",
        });
      },
    },
  })
);

// ============================================
// 404 Handler
// ============================================

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: "The requested API endpoint does not exist",
  });
});

// ============================================
// Error Handler
// ============================================

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Gateway] Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`📡 Routes:`);
  console.log(`   /api/v1/auth/*          → ${AUTH_SERVICE}`);
  console.log(`   /api/v1/content/*       → ${CONTENT_SERVICE}`);
  console.log(`   /api/v1/projects/*      → ${CONTENT_SERVICE} (rewrite)`);
  console.log(`   /api/v1/services/*      → ${CONTENT_SERVICE} (rewrite)`);
  console.log(`   /api/v1/testimonials/*  → ${CONTENT_SERVICE} (rewrite)`);
  console.log(`   /api/v1/faqs/*          → ${CONTENT_SERVICE} (rewrite)`);
  console.log(`   /api/v1/contacts/*      → ${CONTENT_SERVICE} (rewrite)`);
  console.log(`   /api/v1/analytics/*     → ${ANALYTICS_SERVICE}`);
  console.log(`   /api/v1/dashboard/*     → ${CONTENT_SERVICE}`);
  console.log(`   /api/v1/settings/*      → ${CONTENT_SERVICE}`);
  console.log(`   /health                 → Gateway health check\n`);
});

export default app;
