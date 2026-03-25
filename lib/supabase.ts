import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ddxgwajcmxwiqsemnsup.supabase.co'
const supabaseAnonKey = 'sb_publishable_G8i8AjnR0marBlozuELqrw_WC3NffAS'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)