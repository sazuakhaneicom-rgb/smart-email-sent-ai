import { Response, NextFunction } from 'express';
import { WorkspaceRequest } from './workspace';
import { db } from '../config/firebase-admin';
import { logger } from '../utils/logger';

export const auditLog =
  (action: string) =>
  async (req: WorkspaceRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.uid && req.workspaceId && db.collection) {
        await db
          .collection('workspaces')
          .doc(req.workspaceId)
          .collection('auditLogs')
          .add({
            userId: req.user.uid,
            action,
            targetId: req.params.id || null,
            ip: req.ip,
            userAgent: req.headers['user-agent'] || '',
            timestamp: new Date(),
          });
      }
    } catch (err) {
      logger.warn('Audit log failed:', err);
    }
    next();
  };
