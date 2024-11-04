'use client';

import React, { useState, useCallback, FormEvent } from 'react';
import { User } from '@supabase/supabase-js';
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CommonOutlinedButton from '@/components/Common/CommonOutlinedButton';
import { LogIn } from 'lucide-react';
import getSupabase from '@/lib/supabaseClient'; // Supabase 클라이언트 가져오기

// Props 타입 정의
interface DialogButtonForLoginToSupabaseProps {
    onLoginSuccess: (user: User | null) => void; // 로그인 성공 시 호출되는 콜백 함수
}

const DialogButtonForLoginToSupabase: React.FC<DialogButtonForLoginToSupabaseProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleLogin = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        const supabase = getSupabase();

        if (!supabase) {
            setErrorMessage("Supabase 클라이언트를 초기화하지 못했습니다.");
            return;
        }

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
    }, [email, password, onLoginSuccess]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <CommonOutlinedButton label="로그인" icon={<LogIn className="w-4 h-4" />} iconPosition="left" variant="outline" />
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
                    <CommonOutlinedButton
                        type="submit"
                        disabled={loading}
                        label={loading ? '로그인 중...' : '로그인'}
                        variant="default"
                        icon={<LogIn className="w-4 h-4" />}
                        iconPosition="left"
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DialogButtonForLoginToSupabase;
