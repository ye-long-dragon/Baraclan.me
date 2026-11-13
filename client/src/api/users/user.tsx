import type { User } from '../../dataTypes/dataTypeUser';

const API_BASE = '/api/users';
const STORAGE_KEY = 'baraclan_users_cache';

// Default primary admin user (Me)
export const DEFAULT_ADMIN: User = {
  _id: 'admin_primary_001',
  name: 'Vince Lawrence V. Baraclan',
  email: 'bvincelawrence@gmail.com',
  role: 'admin',
  img: 'https://avatars.githubusercontent.com/u/158171645?v=4',
  createdAt: new Date().toISOString(),
};

function getLocalUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = [
        DEFAULT_ADMIN,
        {
          _id: 'user_sample_002',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'user' as const,
          img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_ADMIN];
  }
}

function saveLocalUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
}

// Check if backend MongoDB is reachable
export async function checkBackendStatus(): Promise<{ connected: boolean; message: string }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return { connected: data.mongodb === 'connected', message: 'MongoDB Online' };
    }
    return { connected: false, message: 'Server Offline (Local Cache Mode)' };
  } catch {
    return { connected: false, message: 'Server Offline (Local Cache Mode)' };
  }
}

// READ ALL
export async function fetchUsers(): Promise<{ users: User[]; isFromMongo: boolean }> {
  try {
    const res = await fetch(API_BASE);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        saveLocalUsers(data.data);
        return { users: data.data, isFromMongo: true };
      }
    }
  } catch (err) {
    console.warn('API /api/users unreachable, falling back to local storage cache:', err);
  }
  return { users: getLocalUsers(), isFromMongo: false };
}

// CREATE
export async function createUser(user: User): Promise<User> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        // Also update local cache
        const local = getLocalUsers();
        saveLocalUsers([data.data, ...local.filter((u) => u._id !== data.data._id)]);
        return data.data;
      }
    }
    const errorData = await res.json().catch(() => ({}));
    if (errorData.message) {
      throw new Error(errorData.message);
    }
  } catch (err: any) {
    console.warn('Could not reach backend to create user, creating in local cache:', err);
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
  }

  // Fallback local creation
  const newUser: User = {
    ...user,
    _id: 'usr_' + Date.now().toString(36),
    createdAt: new Date().toISOString(),
  };
  const current = getLocalUsers();
  saveLocalUsers([newUser, ...current]);
  return newUser;
}

// UPDATE
export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  try {
    const res = await fetch(`${API_BASE}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, _id: id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        const local = getLocalUsers();
        saveLocalUsers(local.map((u) => (u._id === id ? data.data : u)));
        return data.data;
      }
    }
    const errorData = await res.json().catch(() => ({}));
    if (errorData.message) throw new Error(errorData.message);
  } catch (err: any) {
    console.warn('Could not reach backend to update user, updating in local cache:', err);
    if (err.message && !err.message.includes('fetch')) throw err;
  }

  // Fallback local update
  const current = getLocalUsers();
  const updatedList = current.map((u) => (u._id === id ? { ...u, ...user } : u));
  saveLocalUsers(updatedList);
  return updatedList.find((u) => u._id === id) || (user as User);
}

// DELETE
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        const local = getLocalUsers();
        saveLocalUsers(local.filter((u) => u._id !== id));
        return true;
      }
    }
  } catch (err) {
    console.warn('Could not reach backend to delete user, deleting in local cache:', err);
  }

  const current = getLocalUsers();
  saveLocalUsers(current.filter((u) => u._id !== id));
  return true;
}
