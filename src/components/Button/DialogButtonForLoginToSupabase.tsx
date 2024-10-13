'use client';

import React, { useState, useCallback, FormEvent } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Props 타입 정의
interface DialogButtonForLoginToSupabaseProps {
    supabase: SupabaseClient; // Supabase 클라이언트
    onLoginSuccess: (user: User | null) => void; // 로그인 성공 시 호출되는 콜백 함수
}

const DialogButtonForLoginToSupabase: React.FC<DialogButtonForLoginToSupabaseProps> = ({ supabase, onLoginSuccess }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleLogin = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!supabase) return;

        setLoading(true);
        setErrorMessage('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            onLoginSuccess(data.user); // 로그인 성공 시 사용자 정보 전달
            setIsDialogOpen(false); // 다이얼로그 닫기
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }, [email, password, supabase, onLoginSuccess]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">로그인</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>로그인</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                    <Input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    <Button type="submit" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DialogButtonForLoginToSupabase;
