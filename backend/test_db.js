const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function testConnection() {
  console.log("Testing connection to Supabase at:", process.env.SUPABASE_URL);
  const start = Date.now();
  try {
    const { data, error } = await supabase.from("issues").select("id").limit(1);
    const end = Date.now();
    if (error) {
      console.error("Connection failed! Error:", error);
    } else {
      console.log("Connection successful! Data:", data);
    }

    const { data: muni, error: muniErr } = await supabase.from("municipalities").select("*");
    console.log("Municipalities count:", muni?.length, "Error:", muniErr);

    const { data: users, error: userErr } = await supabase.from("users").select("*");
    console.log("Users in public.users:", users?.length, "Error:", userErr);

    console.log(`Took ${end - start}ms`);
  } catch (e) {
    console.error("Exception thrown:", e.message);
  }
}

testConnection();
