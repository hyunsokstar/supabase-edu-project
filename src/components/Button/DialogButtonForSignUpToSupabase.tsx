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
import * as z from 'zod';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import CommonOutlinedButton from '../Common/CommonOutlinedButton';
import { uploadImageToS3 } from '@/lib/uploadImageToS3';

interface DialogButtonForSignUpToSupabaseProps {
    supabase: SupabaseClient;
}

// Zod 스키마 정의
const signUpSchema = z.object({
    email: z.string().email("유효한 이메일을 입력하세요."),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(), // 프로필 필드 추가
    githubUrl: z.string().optional(),
    userImage: z.any().optional(),      // 프로필 이미지 필드 추가
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
});

const DialogButtonForSignUpToSupabase: React.FC<DialogButtonForSignUpToSupabaseProps> = ({ supabase }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [githubUrl, setGithubUrl] = useState<string>('');
    const [userImage, setUserImage] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [fieldErrors, setFieldErrors] = useState<z.ZodIssue[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Presigned URL을 가져오는 함수
    const fetchPresignedUrl = async (fileName: string, folder: string): Promise<{ signedUrl: string, fileUrl: string }> => {
        const res = await fetch(`/api/get-upload-url?file=${fileName}&folder=${folder}`);
        if (!res.ok) {
            throw new Error('Presigned URL 가져오기 실패');
        }
        const data = await res.json();
        return { signedUrl: data.url, fileUrl: data.fileUrl };
    };

    const handleSignUp = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Zod 유효성 검사 수행
        const validationResult = signUpSchema.safeParse({
            email,
            password,
            confirmPassword,
            phoneNumber,
            githubUrl,
            userImage
        });

        if (!validationResult.success) {
            setFieldErrors(validationResult.error.issues);
            setErrorMessage("입력한 정보를 다시 확인하세요.");
            return;
        }

        setFieldErrors([]);
        setLoading(true);
        setErrorMessage('');

        try {
            // 1. Presigned URL 요청 후 파일 업로드
            let userImageUrl = null;
            if (userImage) {
                const fileExtension = userImage.name.split('.').pop() || 'jpg';
                const fileName = `${email}-${uuidv4()}.${fileExtension}`;
                const { signedUrl, fileUrl } = await fetchPresignedUrl(fileName, 'profiles');

                await uploadImageToS3(userImage, signedUrl); // 이미지 업로드
                userImageUrl = fileUrl; // 업로드된 이미지 URL
            }

            // 2. auth.users에 사용자 추가
            const { data: signUpData, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            const userId = signUpData?.user?.id;

            // 3. profile 테이블에 데이터 추가
            if (userId) {
                const { error: profileError } = await supabase.from('profile').insert({
                    user_id: userId,
                    phone_number: phoneNumber,
                    github_url: githubUrl,
                    user_image: userImageUrl,
                    current_task: 'N/A',
                    today_completed_tasks_count: 0,
                });

                if (profileError) {
                    throw profileError;
                }
            }

            setIsDialogOpen(false);
            toast.success('회원가입이 완료되었습니다. 이메일을 확인해 주세요!', {
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
            setPhoneNumber('');
            setGithubUrl('');
            setUserImage(null);
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }, [email, password, confirmPassword, supabase, phoneNumber, githubUrl, userImage]);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUserImage(e.target.files[0]);
        }
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <CommonOutlinedButton
                        label="회원가입"
                        icon={<UserPlus className="w-4 h-4" />}
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
                            {fieldErrors.find((error) => error.path[0] === "confirmPassword") && (
                                <p className="text-red-500 text-sm">
                                    {fieldErrors.find((error) => error.path[0] === "confirmPassword")?.message}
                                </p>
                            )}
                        </div>

                        {/* 프로필 정보 */}
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium">전화번호</Label>
                            <Input
                                id="phoneNumber"
                                type="text"
                                placeholder="010-1234-5678"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="githubUrl" className="text-sm font-medium">GitHub URL</Label>
                            <Input
                                id="githubUrl"
                                type="text"
                                placeholder="https://github.com/your-profile"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userImage" className="text-sm font-medium">프로필 이미지</Label>
                            <Input
                                id="userImage"
                                type="file"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border rounded-md"
                            />
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
