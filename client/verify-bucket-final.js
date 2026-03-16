import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error.message);
  } else {
    const bucket = buckets.find(b => b.name === 'project-files');
    if (bucket) {
      console.log('SUCCESS: "project-files" bucket found!');
      // Check if we can list files in it (might be empty)
      const { data: files, error: fileError } = await supabase.storage.from('project-files').list();
      if (fileError) {
         console.log('Note: Could not list files (likely empty or policy restriction):', fileError.message);
      } else {
         console.log(`Files count in bucket: ${files.length}`);
      }
    } else {
      console.log('FAILURE: "project-files" bucket still not found.');
    }
  }
}

verifyBucket();
