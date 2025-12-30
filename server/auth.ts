import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { emailService } from "./email";

// Auth-specific rate limiter - 5 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many authentication attempts, please try again in 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

if (!process.env.SESSION_SECRET) {
  throw new Error("Environment variable SESSION_SECRET not provided");
}

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET;

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // CSRF protection - prevents cross-origin cookie sending
      maxAge: sessionTtl,
    },
  });
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy (Email/Password)
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'No user found with this email' });
        }

        if (!user.passwordHash) {
          return done(null, false, { message: 'Please sign in with Google or reset your password' });
        }

        const isValidPassword = await comparePassword(password, user.passwordHash);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await storage.getUserByGoogleId(profile.id);
        
        if (!user) {
          // Check if user exists with this email
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await storage.getUserByEmail(email);
            if (user) {
              // Link Google account to existing user
              await storage.linkGoogleAccount(user.id, profile.id);
            }
          }
        }

        if (!user && profile.emails?.[0]?.value) {
          // Create new user
          user = await storage.createUser({
            email: profile.emails[0].value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            profileImageUrl: profile.photos?.[0]?.value,
            googleId: profile.id,
            isEmailVerified: true, // Google emails are verified
          });
        }

        if (!user) {
          return done(new Error('Failed to create user'), false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
    ));
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Auth Routes - Protected by rate limiting
  app.post("/api/auth/signup", authLimiter, async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate input
      if (!email || !password || !firstName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password and create user
      const passwordHash = await hashPassword(password);
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
      });

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user.email, user.firstName || 'Friend');
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail signup if email fails
      }

      // Log user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to login after signup" });
        }
        res.json({ user, message: "Account created successfully" });
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/auth/signin", authLimiter, (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Failed to login" });
        }
        res.json({ user, message: "Signed in successfully" });
      });
    })(req, res, next);
  });

  app.get("/api/auth/google", passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get("/api/auth/google/callback", 
    passport.authenticate('google', { failureRedirect: '/auth/signin' }),
    (req, res) => {
      // Successful authentication
      res.redirect('/');
    }
  );

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          return res.status(500).json({ message: "Failed to destroy session" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
      });
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUserWithProfiles((req.user as any).id);
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  // Check for session-based admin access first (for admin panel access)
  if ((req.session as any)?.isAdmin) {
    return next();
  }

  // Fall back to user-based admin checking
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const isAdmin = await storage.isUserAdmin((req.user as any).id);
    if (!isAdmin) {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
  } catch (error) {
    console.error("Error checking admin privileges:", error);
    return res.status(500).json({ message: "Failed to verify admin privileges" });
  }
};

// New middleware for development admin access
export const requireDevAdmin: RequestHandler = (req, res, next) => {
  // Check for admin session access
  if ((req.session as any)?.isAdmin) {
    return next();
  }

  // Check for development admin access code in headers
  const devAccessCode = req.headers['x-admin-access'] as string;
  const adminAccessCode = process.env.ADMIN_ACCESS_CODE;

  if (devAccessCode && adminAccessCode && devAccessCode === adminAccessCode) {
    return next();
  }

  return res.status(403).json({ message: "Admin access required" });
};