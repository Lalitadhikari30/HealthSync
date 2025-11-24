import { createClient } from '@supabase/supabase-js';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

export const STORAGE_BUCKET = 'medical-records';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Helper function to get authenticated Supabase client
const getSupabaseWithToken = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the Supabase JWT token using the Firebase Function
    const functions = getFunctions();
    const getToken = httpsCallable(functions, 'getSupabaseToken');
    const result = await getToken({});
    
    if (!result.data?.token) {
      throw new Error('Failed to get Supabase token');
    }
    
    // Create a new Supabase client with the token
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${result.data.token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (error) {
    console.error('Error getting Supabase client:', error);
    throw error;
  }
};

export interface UploadResult {
  data?: {
    path: string;
    fullPath: string;
    url: string;
  };
  error?: Error;
}

export const uploadMedicalRecord = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    // Get authenticated Supabase client
    const supabase = await getSupabaseWithToken();
    
    if (!supabase) {
      throw new Error('Failed to initialize Supabase client');
    }

    // Create a unique file path with user ID and timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return { error };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      data: {
        path: data.path,
        fullPath: `${STORAGE_BUCKET}/${data.path}`,
        url: publicUrl
      }
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { error: error as Error };
  }
};

export const deleteMedicalRecord = async (filePath: string): Promise<{ error?: Error }> => {
  try {
    const supabase = await getSupabaseWithToken();
    if (!supabase) {
      throw new Error('Failed to initialize Supabase client');
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) throw error;
    return {};
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error: error as Error };
  }
};

export const getMedicalRecords = async (userId: string) => {
  try {
    const supabase = await getSupabaseWithToken();
    if (!supabase) {
      throw new Error('Failed to initialize Supabase client');
    }

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(userId, {
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;

    // Add public URL to each file
    const filesWithUrls = await Promise.all(
      data.map(async (file) => {
        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(`${userId}/${file.name}`);
          
        return {
          ...file,
          url: publicUrl,
          fullPath: `${STORAGE_BUCKET}/${userId}/${file.name}`
        };
      })
    );

    return { data: filesWithUrls, error: null };
  } catch (error) {
    console.error('Error fetching files:', error);
    return { data: null, error: error as Error };
  }
};
