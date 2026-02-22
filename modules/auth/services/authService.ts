/**
 * Auth Module - Authentication service
 * Centralizes auth logic. Replace with real API/NextAuth
 * Isolated for testability and swap
 */

export type User = {
  id: string;
  email: string;
  name: string;
};

export async function login(
  email: string,
  password: string
): Promise<{ user: User } | { error: string }> {
  // TODO: Call auth API
  if (!email || !password) {
    return { error: "Email and password required" };
  }
  return {
    user: { id: "1", email, name: "Demo User" },
  };
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: User } | { error: string }> {
  if (data.password.length < 8) {
    return { error: "Password must be 8+ characters" };
  }
  return {
    user: { id: "1", email: data.email, name: data.name },
  };
}
