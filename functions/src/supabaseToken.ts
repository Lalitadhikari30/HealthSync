import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { onCall, HttpsError, onRequest } from 'firebase-functions/v2/https';

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp();
}

// Supabase configuration
const SUPABASE_JWT_SECRET = '3sRLpCmeKLVQNXI+EL/SCMZP/eIOWOHi44XM3dY2LMCGJQn/SLAznoNXTEJgQ4ng7PVi8Vkm25m6wY0e4bYp7w==';
const SUPABASE_URL = 'https://qbfphvazmbtqfwxiuqar.supabase.co';

/**
 * Callable function to get a Supabase JWT token
 * This is the preferred method as it handles CORS automatically
 */
export const getSupabaseToken = onCall({ 
  region: 'us-central1',
  cors: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000']
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = request.auth.uid;
  const email = (request.auth.token as any)?.email || '';

  try {
    const user = await admin.auth().getUser(userId);
    const customClaims = user.customClaims || {};

    const payload = {
      iss: 'supabase',
      sub: userId,
      email,
      user_metadata: { 
        provider: 'email', 
        providers: ['email'] 
      },
      role: 'authenticated',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      aud: 'authenticated',
      ...customClaims,
    } as const;

    const token = jwt.sign(payload as any, SUPABASE_JWT_SECRET, { algorithm: 'HS256' });
    return { 
      token, 
      supabaseUrl: SUPABASE_URL 
    };
  } catch (err) {
    console.error('getSupabaseToken (callable) error:', err);
    throw new HttpsError('internal', 'Could not generate Supabase token');
  }
});

/**
 * HTTP endpoint to get a Supabase JWT token with CORS support
 * This is an alternative for clients that can't use the callable function
 */
export const getSupabaseTokenHttp = onRequest({ region: 'us-central1' }, async (req, res) => {
  // Set CORS headers
  const allowOrigin = process.env.CORS_ORIGIN || 'http://localhost:5174';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '3600');
  res.setHeader('Vary', 'Origin');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Get the Firebase ID token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const idToken = authHeader.toString().substring(7);
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const email = decodedToken.email || '';

    // Get user to include custom claims if any
    const user = await admin.auth().getUser(userId);
    const customClaims = user.customClaims || {};

    // Create Supabase JWT
    const payload = {
      iss: 'supabase',
      sub: userId,
      email,
      user_metadata: {
        provider: 'email',
        providers: ['email'],
      },
      role: 'authenticated',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      aud: 'authenticated',
      ...customClaims,
    } as const;

    const token = jwt.sign(payload as any, SUPABASE_JWT_SECRET, { algorithm: 'HS256' });
    
    res.status(200).json({ 
      token, 
      supabaseUrl: SUPABASE_URL 
    });
  } catch (error: any) {
    console.error('Error generating Supabase token:', error);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      res.status(401).json({ error: 'Invalid or expired token' });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});