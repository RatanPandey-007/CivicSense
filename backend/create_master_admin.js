/**
 * Utility script to create a Master Admin user in Supabase Auth & public.users table.
 * 
 * Usage:
 *   node create_master_admin.js <email> <password> <full_name>
 * Example:
 *   node create_master_admin.js admin@fixitnow.com AdminPassword123! "Chief Master Admin"
 */

require("dotenv").config();
const { supabase } = require("./supabaseClient");

async function createMasterAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || "admin@fixitnow.com";
  const password = args[1] || "Admin12345!";
  const fullName = args[2] || "Master Admin";

  console.log(`\nCreating Master Admin:`);
  console.log(`- Email: ${email}`);
  console.log(`- Full Name: ${fullName}`);

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      role: "master_admin",
      full_name: fullName,
    },
  });

  if (authError) {
    if (authError.message && authError.message.includes("already registered")) {
      console.log(`⚠️ User ${email} already exists in auth. Fetching user list...`);
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === email);
      if (existing) {
        await supabase.from("users").upsert({
          id: existing.id,
          role: "master_admin",
          full_name: fullName,
        });
        console.log(`✅ Updated existing user ${email} to role 'master_admin' in public.users!`);
        return;
      }
    }
    console.error("❌ Auth Creation Error:", authError.message);
    return;
  }

  const userId = authData.user.id;

  // 2. Insert/upsert into public.users table
  const { error: dbError } = await supabase.from("users").upsert([
    {
      id: userId,
      role: "master_admin",
      full_name: fullName,
    },
  ]);

  if (dbError) {
    console.error("❌ Database Upsert Error:", dbError.message);
    return;
  }

  console.log(`\n🎉 SUCCESS! Master Admin created successfully.`);
  console.log(`User ID: ${userId}`);
  console.log(`You can now log in to the Admin Dashboard using:`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);
}

createMasterAdmin();
