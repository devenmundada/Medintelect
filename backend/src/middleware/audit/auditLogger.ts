import { Request, Response, NextFunction } from 'express';

// Minimal HIPAA-compliance audit logger
export function auditLogger(req: Request, res: Response, next: NextFunction) {
  // In production: save to a persistent log, e.g., Mongo/SQL/S3/SIEM
  // This is a stub for now
  if (process.env.AUDIT_LOGGING_ENABLED === 'true') {
    console.log(`[AUDIT] method=${req.method} url=${req.originalUrl} user=${req.user ? req.user.id : 'anonymous'}`);
  }
  next();
}
