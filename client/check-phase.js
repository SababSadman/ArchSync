import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPhaseColumns() {
  console.log('--- Checking Phase Columns ---');
  
  const { error: error1 } = await supabase.from('files').select('phase').limit(1);
  console.log('Check "phase":', error1 ? 'MISSING (' + error1.message + ')' : 'EXISTS');
  
  const { error: error2 } = await supabase.from('files').select('project_phase').limit(1);
  console.log('Check "project_phase":', error2 ? 'MISSING (' + error2.message + ')' : 'EXISTS');
  
  const { error: error3 } = await supabase.from('files').select('current_phase').limit(1);
  console.log('Check "current_phase":', error3 ? 'MISSING (' + error3.message + ')' : 'EXISTS');
}

checkPhaseColumns();
