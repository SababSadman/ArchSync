import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectSchema() {
  console.log('--- Inspecting Columns ---');
  // We can't query information_schema directly via .from() usually unless it's exposed.
  // Let's try to query a non-existent column to see if it lists valid ones in the error.
  const tables = ['files', 'file_versions'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('non_existent_column').limit(1);
    if (error) {
      console.log(`Table ${table} Error: ${error.message}`);
    }
  }

  console.log('\n--- Checking Buckets ---');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
     console.log('Buckets Error:', bucketError.message);
  } else {
     console.log('Buckets:', buckets.map(b => b.name));
  }
}

inspectSchema();
