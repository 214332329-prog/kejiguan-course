import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddxgwajcmxwiqsemnsup.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_G8i8AjnR0marBlozuELqrw_WC3NffAS'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)