export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const handleError = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: 'Internal server error' });
};
