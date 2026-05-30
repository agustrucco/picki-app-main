import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndnwnrjqshbzrkwhbocn.supabase.co'; // Tu URL real (ejemplo)
const supabaseAnonKey = 'sb_publishable_3PYmRoa7v2XrSPJU9zrguQ_uE9Naq58'; // Tu clave real

export const supabase = createClient(supabaseUrl, supabaseAnonKey);