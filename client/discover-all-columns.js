import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function discoverAllColumns() {
  console.log('--- Discovering Columns for "files" ---');
  // Try to query a non-existent column to see the full list of columns in the error
  const { error } = await supabase.from('files').select('force_error_hint_column');
  
  if (error) {
    console.log('Error Message:', error.message);
    // Usually the message contains "Column '...' not found in table '...'. Did you mean one of these: id, name, ..."
  } else {
    console.log('Wait, it worked? That means force_error_hint_column exists.');
  }
}

discoverAllColumns();
