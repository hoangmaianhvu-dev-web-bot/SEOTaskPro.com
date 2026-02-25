import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vazcxsysafpykojhcuud.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_K5gu-eNcBwtGx64oW2MwlQ_hrZgs4zL';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
