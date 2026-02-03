import express from "express";
import analysisRoute from "./routes/analysis.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";
import logger from "./middlewares/logger.middleware.js";
import cors from "cors";
import rateLimiter from "./middlewares/rateLimit.middleware.js";

const app = express();

app.use(cors());
app.use(logger); // Log all requests
app.use(rateLimiter); // Rate limiting: 10 req/min per IP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Career Gap API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});
app.use("/api", analysisRoute);

// 404
app.use(notFound);

// Error
app.use(errorHandler);

export default app;
