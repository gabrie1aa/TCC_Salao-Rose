import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ' https://pmeehckvuzygmzzkmcos.supabase.co '
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ' sb_publishable_J41GwV1PrhsPQZSXZxtngw_bltP2SHM '

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
