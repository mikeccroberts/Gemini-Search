import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';

config();

const USERNAME = process.env.AUTH_USERNAME;
const PASSWORD = process.env.AUTH_PASSWORD;

// Simple session storage (in production, use Redis or a proper session store)
const sessions = new Set<string>();

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.sessionId;
  
  if (sessions.has(sessionId)) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized', isAuthenticated: false });
  }
}

export function setupAuthRoutes(app: any) {
  // Login route
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === USERNAME && password === PASSWORD) {
      const sessionId = Math.random().toString(36).substring(7);
      sessions.add(sessionId);
      
      // Set cookie with session ID
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ message: 'Login successful', isAuthenticated: true });
    } else {
      res.status(401).json({ message: 'Invalid credentials', isAuthenticated: false });
    }
  });

  // Logout route
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      sessions.delete(sessionId);
      res.clearCookie('sessionId');
    }
    res.json({ message: 'Logged out successfully', isAuthenticated: false });
  });

  // Auth status check route
  app.get('/api/auth/status', (req: Request, res: Response) => {
    const sessionId = req.cookies?.sessionId;
    if (sessions.has(sessionId)) {
      res.json({ isAuthenticated: true });
    } else {
      res.status(401).json({ isAuthenticated: false });
    }
  });
} 