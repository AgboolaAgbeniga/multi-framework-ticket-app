export type Session = {
  userId: string;
  name: string;
  email?: string;
};

const SESSION_KEY = 'ticketapp_session';
const AUTH_TOKEN_KEY = 'ticketapp_auth';

// Read session from the new token-based storage if present, otherwise fall back
// to the old `ticketapp_session` key for backwards compatibility.
export function getSession(): Session | null {
  try {
    const tokenRaw = localStorage.getItem(AUTH_TOKEN_KEY);
    if (tokenRaw) {
      try {
        const token = JSON.parse(tokenRaw) as { token: string; expiresAt: string; user: { id: string | number; email?: string; name: string } };
        if (new Date(token.expiresAt) > new Date()) {
          return { userId: String(token.user.id), name: token.user.name, email: token.user.email };
        }
        // expired -> remove
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }

    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

type AuthResult = { success: true; session: Session } | { success: false; error: string };

export function login(email: string, password: string): AuthResult {
  // Demo credentials
  if (email === 'demo@ticketapp.com' && password === 'demo123') {
    const session: Session = { userId: 'demo', name: 'Demo User', email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
  }

  // Very small demo auth: accept any non-empty credentials but require password length >=6
  if (!email || !password) return { success: false, error: 'Missing credentials' };
  if (password.length < 6) return { success: false, error: 'Invalid password' };

  const session: Session = { userId: email, name: email.split('@')[0], email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, session };
}

export function signup(email: string, password: string, name?: string): AuthResult {
  if (!email || !password) return { success: false, error: 'Missing credentials' };
  if (password.length < 6) return { success: false, error: 'Password too short' };

  const session: Session = { userId: email, name: name ?? email.split('@')[0], email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, session };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export default { getSession, login, signup, logout };