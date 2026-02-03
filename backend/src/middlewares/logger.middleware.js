export default function logger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Log incoming request
  console.log(`📥 [${timestamp}] ${req.method} ${req.originalUrl}`);

  // Log request body if present (for debugging)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, JSON.stringify(req.body, null, 2));
  }

  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusEmoji = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${statusEmoji} [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
}
