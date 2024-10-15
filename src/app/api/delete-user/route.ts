// src/app/api/delete-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getSupabase from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        const supabaseAdmin = getSupabase();
        if (!supabaseAdmin) {
            throw new Error('Failed to initialize Supabase client');
        }

        // auth.users에서 사용자 삭제
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) throw error;

        // profile 테이블에서도 사용자 삭제
        const { error: profileDeleteError } = await supabaseAdmin
            .from('profile')
            .delete()
            .eq('user_id', userId);

        if (profileDeleteError) throw profileDeleteError;

        return NextResponse.json({ message: 'User successfully deleted' }, { status: 200 });
    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { message: error.message || 'An unknown error occurred' },
            { status: 500 }
        );
    }
}