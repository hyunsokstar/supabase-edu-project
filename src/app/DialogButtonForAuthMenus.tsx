'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { createClient, User, SupabaseClient } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from 'lucide-react';
import DialogButtonForLoginToSupabase from '@/components/Button/DialogButtonForLoginToSupabase';
import DialogButtonForSignUpToSupabase from '@/components/Button/DialogButtonForSignUpToSupabase';

const DialogButtonForAuthMenus: React.FC = () => {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Supabase 클라이언트 초기화 및 auth listener 설정
    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseKey) {
            const supabaseClient = createClient(supabaseUrl, supabaseKey);
            setSupabase(supabaseClient);

            const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
                setUser(session?.user ?? null);
            });

            return () => {
                authListener.subscription.unsubscribe();
            };
        }
    }, []);

    const handleLogout = useCallback(async () => {
        if (!supabase) return;

        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error: any) {
            console.error("로그아웃 실패:", error.message);
        }
    }, [supabase]);

    const handleLoginSuccess = (user: User | null) => {
        setUser(user);
    };

    if (!supabase) return null;

    return (
        <div>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.email || ''} />
                                <AvatarFallback>{user.email ? user.email[0].toUpperCase() : <UserIcon />}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || '사용자'}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.id}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>로그아웃</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <div className="flex space-x-2">  {/* flex와 space-x-*로 버튼 사이에 간격 추가 */}
                        {/* 로그인 버튼 */}
                        <DialogButtonForLoginToSupabase supabase={supabase} onLoginSuccess={handleLoginSuccess} />
                        {/* 회원가입 버튼 */}
                        <DialogButtonForSignUpToSupabase supabase={supabase} />
                    </div>
                </>

            )}
        </div>
    );
};

export default DialogButtonForAuthMenus;
