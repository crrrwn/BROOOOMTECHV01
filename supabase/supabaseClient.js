import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://bpepaznvurkajdsjvzmv.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZXBhem52dXJrYWpkc2p2em12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Mzg4NjUsImV4cCI6MjA2NjQxNDg2NX0.l5e0Xe7cXsek2o5MwK9psyTgJ9TZmVphtaHy1MXb8s4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
