import { usersRepository } from '../../repositories/users.repository';
import { auth } from '../../config/firebase-admin';
import { logger } from '../../utils/logger';

export interface UpdateProfileDto {
  displayName?: string;
  photoURL?: string;
  language?: string;
  timezone?: string;
  phoneNumber?: string;
}

export class SettingsService {
  async getProfile(userId: string) {
    const profile = await usersRepository.findById(userId);
    if (!profile) throw new Error('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Update Firebase Auth display name and photo
    if (auth.updateUser && (dto.displayName || dto.photoURL)) {
      try {
        await auth.updateUser(userId, {
          ...(dto.displayName && { displayName: dto.displayName }),
          ...(dto.photoURL && { photoURL: dto.photoURL }),
        });
      } catch (err) {
        logger.warn('Firebase Auth profile update failed:', err);
      }
    }

    const profile = await usersRepository.update(userId, dto);
    if (!profile) throw new Error('Profile not found');
    return profile;
  }

  async getSessions(userId: string) {
    // Firebase doesn't expose session list server-side
    // Return current session indicator
    return {
      currentSession: {
        userId,
        createdAt: new Date(),
        deviceInfo: 'Current session',
      },
      note: 'Use Firebase Auth SDK to manage sessions client-side',
    };
  }

  async revokeAllSessions(userId: string) {
    if (auth.revokeRefreshTokens) {
      await auth.revokeRefreshTokens(userId);
      logger.info(`All sessions revoked for user ${userId}`);
    }
    return { revoked: true };
  }
}

export const settingsService = new SettingsService();
