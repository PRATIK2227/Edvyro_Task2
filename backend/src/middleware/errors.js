import { logger } from '../config/logger.js';
import { HttpError } from '../utils/HttpError.js';
export function notFound(req, _res, next) { next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND')); }
export function errorHandler(error, req, res, _next) {
  const status = error.status || 500;
  if (status >= 500) logger.error({ err: error, requestId: req.id }, 'API error');
  res.status(status).json({
    success: false,
    error: { code: error.code || 'INTERNAL_SERVER_ERROR', message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Unexpected server error' : error.message, ...(error.details ? { details: error.details } : {}) },
    requestId: req.id,
  });
}
