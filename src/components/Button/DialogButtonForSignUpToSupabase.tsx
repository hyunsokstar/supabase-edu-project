'use client';

import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SupabaseClient } from '@supabase/supabase-js';
import { Loader2, Eye, EyeOff, UserPlus } from 'lucide-react';
import * as z from 'zod';  // Zod 라이브러리 추가
import { toast } from 'react-toastify';  // react-toastify 임포트
import CommonOutlinedButton from '../Common/CommonOutlinedButton';

interface DialogButtonForSignUpToSupabaseProps {
    supabase: SupabaseClient;
}

// Zod 스키마 정의
const signUpSchema = z.object({
    email: z.string().email("유효한 이메일을 입력하세요."),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
});

const DialogButtonForSignUpToSupabase: React.FC<DialogButtonForSignUpToSupabaseProps> = ({ supabase }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [fieldErrors, setFieldErrors] = useState<z.ZodIssue[]>([]);  // Zod 오류 처리
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const handleSignUp = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Zod 유효성 검사 수행
        const validationResult = signUpSchema.safeParse({
            email,
            password,
            confirmPassword,
        });

        if (!validationResult.success) {
            setFieldErrors(validationResult.error.issues); // 오류 메시지 설정
            setErrorMessage("입력한 정보를 다시 확인하세요.");
            return;
        }

        setFieldErrors([]); // 오류 초기화
        setLoading(true);
        setErrorMessage('');

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            setIsDialogOpen(false);
            toast.success('회원가입이 완료되었습니다. 이메일을 확인해 주세요!', { // 성공 토스트 메시지
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }, [email, password, confirmPassword, supabase]);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <CommonOutlinedButton
                        label="회원가입"
                        icon={<UserPlus className="w-4 h-4" />} // 아이콘 적용
                        size="default"
                        color="primary"
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">회원 가입</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSignUp} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                            />
                            {/* 이메일 오류 메시지 */}
                            {fieldErrors.find((error) => error.path[0] === "email") && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.find((error) => error.path[0] === "email")?.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">비밀번호</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-md pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                </button>
                            </div>
                            {/* 비밀번호 오류 메시지 */}
                            {fieldErrors.find((error) => error.path[0] === "password") && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.find((error) => error.path[0] === "password")?.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">비밀번호 확인</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-md pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                </button>
                            </div>
                            {/* 비밀번호 확인 오류 메시지 */}
                            {fieldErrors.find((error) => error.path[0] === "confirmPassword") && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.find((error) => error.path[0] === "confirmPassword")?.message}
                                </p>
                            )}
                        </div>
                        {errorMessage && (
                            <Alert variant="destructive">
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                        <DialogFooter>
                            <CommonOutlinedButton
                                label="회원가입"
                                icon={<UserPlus className="w-4 h-4" />}
                                size="lg"
                                color="primary"
                                className="w-full"
                                disabled={loading}
                            />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default DialogButtonForSignUpToSupabase;