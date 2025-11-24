import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'express';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configuration
const SUPABASE_JWT_SECRET = '3sRLpCmeKLVQNXI+EL/SCMZP/eIOWOHi44XM3dY2LMCGJQn/SLAznoNXTEJgQ4ng7PVi8Vkm25m6wY0e4bYp7w==';
const SUPABASE_URL = 'https://qbfphvazmbtqfwxiuqar.supabase.co';
const ALLOWED_ORIGIN = 'http://localhost:5173';

interface ErrorWithCode extends Error {
  code?: string;
}

export const getSupabaseTokenCors = onRequest(
  { cors: ALLOWED_ORIGIN },
  async (req: Request, res: Response): Promise<void> => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    try {
      // Get the Firebase ID token from the Authorization header
      const authHeader = req.headers.authorization;
      if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid Authorization header' });
        return;
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
      const email = decodedToken.email || '';

      // Create Supabase JWT
      const payload = {
        iss: 'supabase',
        sub: userId,
        email: email,
        user_metadata: {
          provider: 'email',
          providers: ['email'],
        },
        role: 'authenticated',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        aud: 'authenticated',
      };

      const token = jwt.sign(payload, SUPABASE_JWT_SECRET, { algorithm: 'HS256' });

      res.status(200).json({
        token,
        supabaseUrl: SUPABASE_URL,
      });
    } catch (error: unknown) {
      console.error('Error generating Supabase token:', error);
      const err = error as ErrorWithCode;
      
      if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
        res.status(401).json({ error: 'Invalid or expired token' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);