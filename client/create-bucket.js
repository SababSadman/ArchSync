import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucket() {
  console.log('Attempting to create "project-files" bucket...');
  const { data, error } = await supabase.storage.createBucket('project-files', {
    public: false,
    allowedMimeTypes: ['image/*', 'application/pdf', 'application/octet-stream'],
    fileSizeLimit: 524288000 // 500MB
  });

  if (error) {
    console.error('Error creating bucket:', error.message);
    console.log('\nDIAGNOSIS: You need to create the bucket manually in the Supabase Dashboard.');
  } else {
    console.log('Bucket created successfully!', data);
  }
}

createBucket();
