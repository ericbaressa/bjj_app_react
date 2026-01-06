import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfwqbfkthhftrvtkybcw.supabase.co';
const supabaseKey = 'sb_publishable_nqJJCCKrYnCpuqCfwDs8SQ_k55qpXV6';
export const supabase = createClient(supabaseUrl, supabaseKey);
