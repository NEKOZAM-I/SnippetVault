/**
 * Supabase client setup.
 *
 * 1. Create a free project at https://supabase.com
 * 2. Go to Project Settings → API
 * 3. Copy your "Project URL" and "anon public" key below
 * 4. Run the SQL in /supabase/schema.sql inside the Supabase SQL editor
 *
 * NOTE: The "anon" key is safe to expose in client-side code — it is
 * designed for this. Access control is enforced by Row Level Security
 * policies defined in schema.sql, not by hiding this key.
 */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// `supabase` here refers to the global object injected by the
// @supabase/supabase-js CDN script loaded in index.html.
// We name our client `sb` to avoid shadowing that global.
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
