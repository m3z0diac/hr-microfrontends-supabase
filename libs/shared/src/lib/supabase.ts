

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eeyubjkfuosmpyzwikqs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleXViamtmdW9zbXB5endpa3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0OTc4MDgsImV4cCI6MjA4NDA3MzgwOH0.yTnMPM7fWmorZpQU66bYlEUqEDuhummVQ-zL1L_sl8g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: true
  }
});
