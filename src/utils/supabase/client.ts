import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create a single instance of the client
export const supabase = createClient(supabaseUrl, publicAnonKey);
