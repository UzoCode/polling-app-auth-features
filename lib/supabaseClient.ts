// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;


export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);


export const supabase = hasSupabase
? createClient(supabaseUrl!, supabaseAnonKey!)
: (null as any);