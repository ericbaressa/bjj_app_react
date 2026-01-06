import { createClient } from '@supabase/supabase-js';

// URL pública de tu proyecto Supabase
const supabaseUrl = 'https://kfwqbfkthhftrvtkybcw.supabase.co';

// API key segura (en Vite usamos prefijo VITE_)
const supabaseKey ='sb_publishable_nqJJCCKrYnCpuqCfwDs8SQ_k55qpXV6';

export const supabase = createClient(supabaseUrl, supabaseKey);

