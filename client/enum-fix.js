import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwpdaicvlquwwutjjxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGRhaWN2bHF1d3d1dGpqeHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNzUsImV4cCI6MjA4OTA3NDE3NX0.YzSWTvoOPvDeKGAnO3KPZbhju1hC2nXEic1KH91HV3k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findValidEnums() {
  console.log('--- Step 1: Find a valid user and organization ---');
  let userId, orgId;

  const { data: userData } = await supabase.auth.admin.listUsers();
  if (userData?.users?.length > 0) {
    userId = userData.users[0].id;
    console.log('Using user:', userId);
  } else {
    // Try to get from public profile if possible
    const { data: profile } = await supabase.from('profiles').select('id').limit(1).single();
    if (profile) userId = profile.id;
  }

  const { data: org } = await supabase.from('organizations').select('id').limit(1).single();
  if (org) {
    orgId = org.id;
    console.log('Using organization:', orgId);
  }

  if (!orgId || !userId) {
    console.log('Could not find existing org/user. Enum errors will still be descriptive even if FK fails.');
  }

  const categories = {
    design: [
      'design_dev', 'design_development', 'dd', 'design', 
      'design-dev', 'design development', 'design_dev_docs',
      'development', 'designing'
    ],
  };

  const results = {};

  for (const [cat, values] of Object.entries(categories)) {
    console.log(`\nTesting Category: ${cat}`);
    for (const val of values) {
      const { error } = await supabase.from('projects').insert([{
        name: 'Enum Test',
        phase: val,
        project_type: 'residential',
        status: 'active',
        organization_id: orgId || '00000000-0000-0000-0000-000000000000',
        created_by: userId || '00000000-0000-0000-0000-000000000000'
      }]);

      if (error && error.message.includes('invalid input value for enum project_phase')) {
        console.log(`  [X] ${val}`);
      } else {
        const otherError = error ? ` (Other error: ${error.message})` : ' (Success!)';
        console.log(`  [V] ${val}${otherError}`);
        results[cat] = val;
        break;
      }
    }
  }

  console.log('\n--- FINAL VALID ENUMS ---');
  console.log(JSON.stringify(results, null, 2));
}

findValidEnums();
