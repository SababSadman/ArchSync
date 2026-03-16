import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectFilesTable() {
  console.log('--- Checking "files" table structure ---');
  // Querying a non-existent column to force PostgREST to show the actual schema in the error hint or success
  const { data, error } = await supabase.from('files').select('*').limit(0);
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    // If successful but empty, we might not see column names easily without data.
    // Let's try to get a sample or force an error that lists columns.
    const { error: colError } = await supabase.from('files').select('non_existent').limit(1);
    console.log('\nColumn hint from error:');
    console.log(colError?.message);
  }
}

inspectFilesTable();
