export interface PlatformUser {
  uid: string;
  name: string;
  email: string;
  workspace: string;
  plan: 'Free' | 'Pro' | 'Business';
  role: 'User' | 'Admin';
  status: 'active' | 'blocked';
  joinedAt: string;
}

const DEFAULT_USERS: PlatformUser[] = [
  { uid: 'USR-101', name: 'সাজু আখন্দ', email: 'sazu@akheni.com', workspace: 'Akheni Tech', plan: 'Business', role: 'Admin', status: 'active', joinedAt: '2025-01-10' },
  { uid: 'USR-102', name: 'রহিম চৌধুরী', email: 'rahim@example.com', workspace: 'Digital Commerce', plan: 'Pro', role: 'User', status: 'active', joinedAt: '2025-02-01' },
  { uid: 'USR-103', name: 'করিম শেখ', email: 'karim@example.com', workspace: 'Karim Store', plan: 'Free', role: 'User', status: 'active', joinedAt: '2025-02-15' },
  { uid: 'USR-104', name: 'নাসরিন সুলতানা', email: 'nasrin@example.com', workspace: 'Style BD', plan: 'Pro', role: 'User', status: 'active', joinedAt: '2025-03-01' },
  { uid: 'USR-105', name: 'জসিম উদ্দিন', email: 'jasim@example.com', workspace: 'Jasim Agency', plan: 'Free', role: 'User', status: 'blocked', joinedAt: '2025-03-12' },
];

export function getPlatformUsers(): PlatformUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem('platform_registered_users');
    if (!raw) {
      localStorage.setItem('platform_registered_users', JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

export function savePlatformUsers(users: PlatformUser[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('platform_registered_users', JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function toggleUserStatus(uid: string): PlatformUser[] {
  const users = getPlatformUsers();
  const updated = users.map(u => {
    if (u.uid === uid) {
      return { ...u, status: u.status === 'active' ? 'blocked' as const : 'active' as const };
    }
    return u;
  });
  savePlatformUsers(updated);
  return updated;
}

export function deleteUser(uid: string): PlatformUser[] {
  const users = getPlatformUsers();
  const updated = users.filter(u => u.uid !== uid);
  savePlatformUsers(updated);
  return updated;
}

export function addUser(user: Omit<PlatformUser, 'uid' | 'joinedAt'>): PlatformUser[] {
  const users = getPlatformUsers();
  const newUser: PlatformUser = {
    ...user,
    uid: `USR-${Math.floor(100 + Math.random() * 900)}`,
    joinedAt: new Date().toISOString().split('T')[0],
  };
  const updated = [newUser, ...users];
  savePlatformUsers(updated);
  return updated;
}

export function updateUserRolePlan(uid: string, role: 'User' | 'Admin', plan: 'Free' | 'Pro' | 'Business'): PlatformUser[] {
  const users = getPlatformUsers();
  const updated = users.map(u => {
    if (u.uid === uid) {
      return { ...u, role, plan };
    }
    return u;
  });
  savePlatformUsers(updated);
  return updated;
}
