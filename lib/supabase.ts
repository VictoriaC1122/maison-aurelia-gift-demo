import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** 尚未填入 Supabase 金鑰時，網站會以「展示模式」運作（訂單只存在瀏覽器）。 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

let client: SupabaseClient | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  }
  return client;
}
