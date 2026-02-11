import "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { projectsRouter } from "./routes/projects.routes";
import { servicesRouter } from "./routes/services.routes";
import { testimonialsRouter } from "./routes/testimonials.routes";
import { faqsRouter } from "./routes/faqs.routes";
import { contactsRouter } from "./routes/contacts.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { settingsRouter } from "./routes/settings.routes";

const app = express();
const PORT = process.env.CONTENT_SERVICE_PORT || 4002;

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
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ success: true, service: "content-service", status: "healthy" });
});

// Routes
app.use("/api/v1/content/projects", projectsRouter);
app.use("/api/v1/content/services", servicesRouter);
app.use("/api/v1/content/testimonials", testimonialsRouter);
app.use("/api/v1/content/faqs", faqsRouter);
app.use("/api/v1/content/contacts", contactsRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/settings", settingsRouter);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Content Service] Error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`📝 Content Service running on http://localhost:${PORT}`);
});

export default app;
