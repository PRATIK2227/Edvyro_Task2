import { HttpError } from '../utils/HttpError.js';
export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({ body: req.body ?? {}, params: req.params ?? {}, query: req.query ?? {} });
  if (!parsed.success) return next(new HttpError(400, 'Request validation failed', 'VALIDATION_ERROR', parsed.error.flatten()));
  req.validated = parsed.data;
  next();
};
