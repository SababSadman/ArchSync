import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkFilesSchema() {
  const tables = ['files', 'file_versions'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: NOT ACCESSIBLE (${error.message})`);
    } else {
      console.log(`Table ${table}: ACCESSIBLE. Columns: ${Object.keys(data[0] || {}).join(', ')}`);
    }
  }
  
  // Also check buckets
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.log(`Buckets: ERROR (${bucketError.message})`);
  } else {
    console.log(`Buckets: ${buckets.map(b => b.name).join(', ')}`);
  }
}

checkFilesSchema();
