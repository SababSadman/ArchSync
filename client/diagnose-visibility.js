import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
  console.log('--- Checking Files Table ---');
  const { data: files, error: filesError } = await supabase
    .from('files')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (filesError) console.error('Files Error:', filesError);
  else console.log('Recent Files:', JSON.stringify(files, null, 2));

  console.log('\n--- Checking Profiles Table ---');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);
  
  if (profilesError) console.error('Profiles Error:', profilesError);
  else console.log('Recent Profiles:', JSON.stringify(profiles, null, 2));

  console.log('\n--- Checking Joins ---');
  const { data: joined, error: joinError } = await supabase
    .from('files')
    .select('name, uploader:profiles!uploaded_by(full_name)')
    .limit(5);
  
  if (joinError) console.error('Join Error:', joinError);
  else console.log('Joined Data:', JSON.stringify(joined, null, 2));
}

diagnose();
