import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Ce client utilise la SERVICE ROLE KEY — accès total, bypass RLS.
// À utiliser UNIQUEMENT dans les API Routes serveur (webhooks, paiements).
// Ne jamais exposer côté client.

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local')
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
