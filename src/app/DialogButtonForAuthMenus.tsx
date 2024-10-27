// src/components/DialogButtonForAuthMenus.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
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
import useUserStore from '@/store/userStore'; // Zustand 스토어 import
import getSupabase from '@/lib/supabaseClient'; // Supabase 클라이언트 가져오기

const DialogButtonForAuthMenus: React.FC = () => {
    const { id, email, isLoggedIn, setUser, clearUser } = useUserStore();
    const [userImage, setUserImage] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const supabase = getSupabase(); // Supabase 클라이언트 가져오기

    // auth listener 설정
    useEffect(() => {
        if (!supabase) return;

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth State Change Event:", event);
            const user = session?.user;
            if (user) {
                setUser({ id: user.id ?? null, email: user.email ?? null });

                // profile 테이블에서 user_image와 phone_number 가져오기
                const { data, error } = await supabase
                    .from('profile')
                    .select('user_image, phone_number')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setUserImage(data.user_image);
                    setPhoneNumber(data.phone_number);
                }
                if (error) {
                    console.error("추가 정보 가져오기 오류:", error.message);
                }
            } else {
                clearUser();
                setUserImage(null);
                setPhoneNumber(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [setUser, clearUser, supabase]);

    const handleLogout = useCallback(async () => {
        if (!supabase) return;

        try {
            await supabase.auth.signOut();
            clearUser();
            setUserImage(null);
            setPhoneNumber(null);
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
                                {/* 프로필 이미지가 있으면 출력하고, 없으면 대체 이미지 표시 */}
                                {userImage ? (
                                    <AvatarImage src={userImage} alt="User Profile Image" />
                                ) : (
                                    <AvatarFallback>{email ? email[0].toUpperCase() : <UserIcon />}</AvatarFallback>
                                )}
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{email}</p>
                                <p className="text-xs leading-none text-muted-foreground">{id}</p>
                                {phoneNumber && <p className="text-xs leading-none text-muted-foreground">{phoneNumber}</p>}
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
                    <DialogButtonForLoginToSupabase onLoginSuccess={(user) => setUser({ id: user?.id ?? null, email: user?.email ?? null })} />
                    <DialogButtonForSignUpToSupabase />
                </div>
            )}
        </div>
    );
};

export default DialogButtonForAuthMenus;
