// src\lib\supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

function initSupabase() {
    if (supabase) return supabase

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables')
        return null
    }

    supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: typeof window !== 'undefined', // 브라우저에서만 세션을 유지합니다.
        }
    })

    return supabase
}

export function getSupabase(): SupabaseClient | null {
    if (typeof window === 'undefined') {
        // 서버 사이드에서는 매번 새로운 인스턴스를 생성합니다.
        return initSupabase()
    }

    // 클라이언트 사이드에서는 기존 인스턴스를 재사용합니다.
    if (!supabase) {
        supabase = initSupabase()
    }

    return supabase
}

export default getSupabase