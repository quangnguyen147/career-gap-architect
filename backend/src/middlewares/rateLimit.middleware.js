import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
    retryAfter: "1 minute"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests (false means count all requests)
  skipSuccessfulRequests: false,
  // Skip failed requests (false means count all requests)
  skipFailedRequests: false,
  // Custom handler for when limit is exceeded
  handler: (req, res) => {
    res.status(429).json({
      status: "error",
      message: "Too many requests from this IP, please try again later.",
      retryAfter: "1 minute"
    });
  }
});

export default rateLimiter;
