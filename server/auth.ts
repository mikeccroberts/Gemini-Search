import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import { randomBytes } from 'crypto';

config();

const USERNAME = process.env.AUTH_USERNAME;
const PASSWORD = process.env.AUTH_PASSWORD;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

if (!USERNAME || !PASSWORD) {
  throw new Error('Authentication credentials are not configured');
}

interface SessionData {
  username: string;
  expiresAt: number;
}

// Simple in-memory session storage (in production, use Redis or a proper session store)
const sessions = new Map<string, SessionData>();

function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}

function pruneExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of Array.from(sessions.entries())) {
    if (session.expiresAt <= now) {
      sessions.delete(id);
    }
  }
}

function unauthorized(res: Response) {
  return res.status(401).json({ message: 'Unauthorized', isAuthenticated: false });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  pruneExpiredSessions();
  const sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    return unauthorized(res);
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return unauthorized(res);
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return unauthorized(res);
  }

  sessions.set(sessionId, {
    username: session.username,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  next();
}

export function setupAuthRoutes(app: any) {
  // Login route
  app.post('/api/auth/login', (req: Request, res: Response) => {
    pruneExpiredSessions();
    const { username, password } = req.body;

    if (username === USERNAME && password === PASSWORD) {
      for (const [id, session] of Array.from(sessions.entries())) {
        if (session.username === username) {
          sessions.delete(id);
        }
      }

      const sessionId = generateSessionId();
      sessions.set(sessionId, {
        username,
        expiresAt: Date.now() + SESSION_TTL_MS,
      });

      // Set cookie with session ID
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: SESSION_TTL_MS,
      });

      res.json({ message: 'Login successful', isAuthenticated: true });
    } else {
      res.status(401).json({ message: 'Invalid credentials', isAuthenticated: false });
    }
  });

  // Logout route
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    pruneExpiredSessions();
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      sessions.delete(sessionId);
      res.clearCookie('sessionId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
    res.json({ message: 'Logged out successfully', isAuthenticated: false });
  });

  // Auth status check route
  app.get('/api/auth/status', (req: Request, res: Response) => {
    pruneExpiredSessions();
    const sessionId = req.cookies?.sessionId;
    const session = sessionId ? sessions.get(sessionId) : undefined;

    if (sessionId && session && session.expiresAt > Date.now()) {
      sessions.set(sessionId, {
        username: session.username,
        expiresAt: Date.now() + SESSION_TTL_MS,
      });
      res.json({ isAuthenticated: true });
    } else {
      res.status(401).json({ isAuthenticated: false });
    }
  });
}
