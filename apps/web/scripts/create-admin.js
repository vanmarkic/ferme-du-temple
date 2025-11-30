import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('\n=== Create Admin User ===\n');

    const email = await question('Admin email: ');
    const password = await question('Admin password (min 6 characters): ');
    const role = await question('Role (admin/super_admin) [admin]: ') || 'admin';

    if (!email || !password || password.length < 6) {
      console.error('\nError: Email and password (min 6 chars) are required');
      rl.close();
      process.exit(1);
    }

    console.log('\nCreating admin user...');

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('\nError creating auth user:', authError.message);
      rl.close();
      process.exit(1);
    }

    console.log('✓ Auth user created');

    // Add to admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email,
        role,
      });

    if (adminError) {
      console.error('\nError creating admin record:', adminError.message);
      console.log('\nNote: Auth user was created. You may need to manually add to admin_users table.');
      rl.close();
      process.exit(1);
    }

    console.log('✓ Admin record created');
    console.log(`\n✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`\nYou can now login at /admin/login\n`);

    rl.close();
  } catch (error) {
    console.error('\nUnexpected error:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();
