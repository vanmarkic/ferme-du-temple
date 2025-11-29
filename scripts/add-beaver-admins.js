import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Beaver members to add as admins
const BEAVER_MEMBERS = [
  { email: 'annabelleczyz@gmail.com', name: 'Annabelle Czyz' },
  { email: 'severinm@me.com', name: 'Severin Malaud' },
  { email: 'j.michel.production@gmail.com', name: 'Jeremy Michel' },
  { email: 'julieluyten@me.com', name: 'Julie Luyten' },
  { email: 'cathyweyders@gmail.com', name: 'Cathy Weyders' },
  { email: 'drag.markovic@gmail.com', name: 'Dragan Markovic' },
  { email: 'colinponthot@gmail.com', name: 'Colin Ponthot' },
  { email: 'uuunam@gmail.com', name: 'Manuela' },
];

async function addBeaverAdmins() {
  console.log('\n=== Adding Beaver Members as Admins ===\n');

  for (const member of BEAVER_MEMBERS) {
    const email = member.email.toLowerCase();
    console.log(`Processing: ${member.name} <${email}>`);

    try {
      // Check if user already exists in auth
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === email
      );

      let userId;

      if (existingUser) {
        console.log(`  ✓ Auth user already exists`);
        userId = existingUser.id;
      } else {
        // Create auth user (with magic link, no password needed)
        // Generate a random password that won't be used
        const randomPassword = Math.random().toString(36).slice(-12) + 'A1!';

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password: randomPassword,
          email_confirm: true,
          user_metadata: { name: member.name },
        });

        if (authError) {
          console.log(`  ✗ Error creating auth user: ${authError.message}`);
          continue;
        }

        console.log(`  ✓ Auth user created`);
        userId = authData.user.id;
      }

      // Check if already in admin_users
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingAdmin) {
        console.log(`  ✓ Already an admin`);
        continue;
      }

      // Add to admin_users table
      const { error: adminError } = await supabase.from('admin_users').insert({
        id: userId,
        email,
        role: 'admin',
      });

      if (adminError) {
        console.log(`  ✗ Error adding to admin_users: ${adminError.message}`);
        continue;
      }

      console.log(`  ✓ Added to admin_users`);
    } catch (error) {
      console.log(`  ✗ Unexpected error: ${error.message}`);
    }
  }

  console.log('\n=== Done ===\n');
  console.log('All members can now login at /admin/login using their email.');
  console.log('They will receive a magic link to sign in (no password required).\n');
}

addBeaverAdmins();
