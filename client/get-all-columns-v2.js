import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getColumns() {
  console.log('--- Checking "files" table ---');
  const { error: error1 } = await supabase.from('files').select('dummy_col').limit(0);
  if (error1) {
    console.log('FILES COLUMNS ERROR:', JSON.stringify(error1, null, 2));
  }

  console.log('\n--- Checking "file_versions" table ---');
  const { error: error2 } = await supabase.from('file_versions').select('dummy_col').limit(0);
  if (error2) {
    console.log('VERSIONS COLUMNS ERROR:', JSON.stringify(error2, null, 2));
  }
}

getColumns();
