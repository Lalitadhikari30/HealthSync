import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with custom headers
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'healthsync-base',
    persistSession: false, // We'll handle session persistence with Firebase
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      // We'll set the Authorization header dynamically
    },
  },
});

interface CachedToken {
  value: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;
let authedClient: SupabaseClient | null = null;

const decodeJwtExpiry = (token: string): number | null => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload && typeof payload.exp === 'number') {
      return payload.exp * 1000; // convert to ms
    }
  } catch (error) {
    console.error('Failed to decode JWT expiry', error);
  }
  return null;
};

const buildAuthedClient = (token: string) =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: 'healthsync-authed',
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

export const getSupabaseWithToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    try {
      const now = Date.now();
      if (cachedToken && authedClient && cachedToken.expiresAt - 60_000 > now) {
        return authedClient;
      }

      const functions = getFunctions(undefined, 'us-central1');
      const getTokenCallable = httpsCallable(functions, 'getSupabaseToken');
      const result = await getTokenCallable({});
      const data = result.data as { token?: string; supabaseUrl?: string };

      if (!data?.token) {
        throw new Error('Supabase token not returned from Cloud Function');
      }

      const expiresAt = decodeJwtExpiry(data.token) ?? (now + 55 * 60_000);
      cachedToken = {
        value: data.token,
        expiresAt,
      };

      authedClient = buildAuthedClient(data.token);

      if (data.supabaseUrl && data.supabaseUrl !== supabaseUrl) {
        console.warn('Supabase URL from function does not match local config. Using local URL.');
      }
      return authedClient;
    } catch (error) {
      console.error('Error getting Firebase ID token:', error);
      throw error;
    }
  }
  
  throw new Error('No authenticated user found');
};

// Storage bucket name
export const STORAGE_BUCKET = 'medical-records';
