/**
 * In-memory user store for V1 authentication.
 * Replace with a proper database in production.
 */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null; // null for OAuth-only users
  provider: "credentials" | "google";
  createdAt: string;
}

// In-memory store — resets on server restart
const users: Map<string, StoredUser> = new Map();

export function findUserByEmail(email: string): StoredUser | undefined {
  for (const user of users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }
  return undefined;
}

export function findUserById(id: string): StoredUser | undefined {
  return users.get(id);
}

export function createUser(user: StoredUser): StoredUser {
  users.set(user.id, user);
  return user;
}

/**
 * Return a safe user object without the password hash.
 */
export function sanitiseUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}
