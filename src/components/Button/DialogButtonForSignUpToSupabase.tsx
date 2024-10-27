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
import { Loader2, Eye, EyeOff, UserPlus } from 'lucide-react';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import CommonOutlinedButton from '../Common/CommonOutlinedButton';
import { uploadImageToS3 } from '@/lib/uploadImageToS3';
import getSupabase from '@/lib/supabaseClient';

const signUpSchema = z.object({
    email: z.string().email("유효한 이메일을 입력하세요."),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    githubUrl: z.string().optional(),
    userImage: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
});

const DialogButtonForSignUpToSupabase: React.FC = () => {
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

        const supabase = getSupabase();

        if (!supabase) {
            setErrorMessage("Supabase 클라이언트를 초기화하지 못했습니다.");
            setLoading(false);
            return;
        }

        try {
            let userImageUrl = null;
            if (userImage) {
                const fileExtension = userImage.name.split('.').pop() || 'jpg';
                const fileName = `${email}-${uuidv4()}.${fileExtension}`;
                const { signedUrl, fileUrl } = await fetchPresignedUrl(fileName, 'profiles');

                await uploadImageToS3(userImage, signedUrl);
                userImageUrl = fileUrl;
            }

            const { data: signUpData, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            const userId = signUpData?.user?.id;

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
    }, [email, password, confirmPassword, phoneNumber, githubUrl, userImage]);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUserImage(e.target.files[0]);
        }
    };

    return (
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
                    {/* 이메일, 비밀번호, 전화번호 등 입력 필드 */}
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
    );
}

export default DialogButtonForSignUpToSupabase;
