import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_CREDENTIALS_KEY = 'hyper_supabase_credentials';

export interface SupabaseCredentials {
  url: string;
  key: string;
  connectedAt: string;
}

let supabaseInstance: SupabaseClient | null = null;

// Safe localStorage wrapper
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove from localStorage:', e);
  }
}

export function saveCredentials(credentials: SupabaseCredentials): void {
  safeSetItem(SUPABASE_CREDENTIALS_KEY, JSON.stringify(credentials));
}

export function getCredentials(): SupabaseCredentials | null {
  const stored = safeGetItem(SUPABASE_CREDENTIALS_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearCredentials(): void {
  safeRemoveItem(SUPABASE_CREDENTIALS_KEY);
  supabaseInstance = null;
}

export function isConnected(): boolean {
  return getCredentials() !== null;
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  
  const credentials = getCredentials();
  if (!credentials || !credentials.url || !credentials.key) return null;
  
  try {
    supabaseInstance = createClient(credentials.url, credentials.key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (e) {
    console.error('Failed to create Supabase client:', e);
    return null;
  }
  
  return supabaseInstance;
}

export async function testConnection(url: string, key: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    
    // Try to query a simple table to verify connection
    const { error } = await client.from('hyper_users').select('count', { count: 'exact', head: true });
    
    if (error) {
      // If table doesn't exist, connection is still valid
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return { success: true };
      }
      // Permission denied means connection works but RLS is blocking
      if (error.code === '42501' || error.message.includes('permission denied')) {
        return { success: true };
      }
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection failed' };
  }
}
