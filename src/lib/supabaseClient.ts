// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

function initSupabase(): SupabaseClient | null {
    // 이미 초기화된 경우 기존 인스턴스를 반환
    if (supabaseClient) return supabaseClient;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase 환경 변수가 누락되었습니다.');
        return null;
    }

    // Supabase 클라이언트 초기화
    try {
        supabaseClient = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: true, // 클라이언트에서 세션 유지
                autoRefreshToken: true,
            },
        });
    } catch (error) {
        console.error("Supabase 클라이언트 초기화 실패:", error);
        supabaseClient = null;
    }

    return supabaseClient;
}

export function getSupabase(): SupabaseClient | null {
    // 클라이언트 사이드에서만 세션을 유지하도록 구현
    if (typeof window === 'undefined') {
        console.warn("서버 사이드에서는 Supabase 인스턴스를 재사용하지 않습니다.");
        return null;
    }

    if (!supabaseClient) {
        supabaseClient = initSupabase();
    }

    return supabaseClient;
}

export default getSupabase;
