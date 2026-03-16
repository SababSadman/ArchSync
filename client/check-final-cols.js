import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkFinal() {
  const { error: e1 } = await supabase.from('files').select('uploaded_by').limit(0);
  console.log('uploaded_by exists:', !e1);

  const { error: e2 } = await supabase.from('files').select('storage_path').limit(0);
  console.log('storage_path exists:', !e2);
  
  const { error: e3 } = await supabase.from('files').select('name').limit(0);
  console.log('name exists:', !e3);
}

checkFinal();
