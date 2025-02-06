import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://qesuvglhqoajyzglfzdy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlc3V2Z2xocW9hanl6Z2xmemR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NTAwNjYsImV4cCI6MjA1NDIyNjA2Nn0.Ff3UCKI0joRfDpT17UGgDNfDWSaN8kzOnP8zLunYfT8';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);