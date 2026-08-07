import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase-admin';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authorization token required', 401, 'UNAUTHORIZED');
      return;
    }
    const token = authHeader.split('Bearer ')[1];

    // In development without Firebase config, allow mock token
    if (process.env.NODE_ENV === 'development' && token === 'dev-token') {
      req.user = { uid: 'dev-user-id', email: 'dev@example.com', name: 'Dev User' };
      next();
      return;
    }

    const decoded = await auth.verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (error) {
    logger.warn('Auth failed:', error);
    sendError(res, 'Invalid or expired token', 401, 'UNAUTHORIZED');
  }
};
