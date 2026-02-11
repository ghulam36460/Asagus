import "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { analyticsRouter } from "./routes/analytics.routes";

const app = express();
const PORT = process.env.ANALYTICS_SERVICE_PORT || 4003;

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:4000",
    ],
    credentials: true,
  })
);
app.use(morgan("short"));
app.use(express.json({ limit: "1mb" }));

// Rate limiting for public tracking endpoints
const trackingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // max 60 tracking requests per minute per IP
  message: { success: false, error: "Too many requests" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1/analytics/pageview", trackingLimiter);
app.use("/api/v1/analytics/event", trackingLimiter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ success: true, service: "analytics-service", status: "healthy" });
});

// Routes
app.use("/api/v1/analytics", analyticsRouter);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Analytics Service] Error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`📊 Analytics Service running on http://localhost:${PORT}`);
});

export default app;
