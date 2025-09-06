'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './supabase'

export const createClient = () => {
  return createClientComponentClient<Database>()
}
