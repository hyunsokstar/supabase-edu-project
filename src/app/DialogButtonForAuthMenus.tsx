// src/components/DialogButtonForAuthMenus.tsx
"use client";

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
import useUserStore from '@/store/userStore'; // zustand 스토어 import

const DialogButtonForAuthMenus: React.FC = () => {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const { id, email, isLoggedIn, setUser, clearUser } = useUserStore();

    // Supabase 클라이언트 초기화 및 auth listener 설정
    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseKey) {
            const supabaseClient = createClient(supabaseUrl, supabaseKey);
            setSupabase(supabaseClient);

            const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
                const user = session?.user;
                if (user) {
                    setUser({ id: user.id ?? null, email: user.email ?? null });
                } else {
                    clearUser();
                }
            });

            return () => {
                authListener.subscription.unsubscribe();
            };
        }
    }, [setUser, clearUser]);

    const handleLogout = useCallback(async () => {
        if (!supabase) return;

        try {
            await supabase.auth.signOut();
            clearUser();
        } catch (error: any) {
            console.error("로그아웃 실패:", error.message);
        }
    }, [supabase, clearUser]);

    if (!supabase) return null;

    return (
        <div>
            {isLoggedIn ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={''} alt={email || ''} />
                                <AvatarFallback>{email ? email[0].toUpperCase() : <UserIcon />}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{email}</p>
                                <p className="text-xs leading-none text-muted-foreground">{id}</p>
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
                <div className="flex space-x-2">
                    <DialogButtonForLoginToSupabase supabase={supabase} onLoginSuccess={(user) => setUser({ id: user?.id ?? null, email: user?.email ?? null })} />
                    <DialogButtonForSignUpToSupabase supabase={supabase} />
                </div>
            )}
        </div>
    );
};

export default DialogButtonForAuthMenus;
