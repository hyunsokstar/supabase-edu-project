'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUploadToS3';
import useSupabaseForUpdateUserInfo from '@/hooks/useSupabaseForUpdateUserInfoForUserId';

interface DialogButtonForUpdateUserInfoProps {
    userId: string;
    initialEmail: string;
    initialPhoneNumber: string;
    initialGithubUrl: string;
    initialUserImage: string;
    initialTodayCompletedTasksCount: number;
    initialCurrentTask: string;
    onClose: () => void;
}

const DialogButtonForUpdateUserInfo: React.FC<DialogButtonForUpdateUserInfoProps> = ({
    userId,
    initialEmail,
    initialPhoneNumber,
    initialGithubUrl,
    initialUserImage,
    initialTodayCompletedTasksCount,
    initialCurrentTask,
    onClose,
}) => {
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
    const [githubUrl, setGithubUrl] = useState(initialGithubUrl);
    const [userImage, setUserImage] = useState<File | null>(null);
    const [todayCompletedTasksCount, setTodayCompletedTasksCount] = useState(initialTodayCompletedTasksCount);
    const [currentTask, setCurrentTask] = useState(initialCurrentTask);

    const updateUserMutation = useSupabaseForUpdateUserInfo();
    const { uploadImage, loading: uploading, error: uploadError } = useImageUpload();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let updatedImageUrl = null;
            if (userImage) {
                const imageUrl = await uploadImage(userImage, 'profiles');
                if (imageUrl) {
                    updatedImageUrl = imageUrl;
                }
            }

            updateUserMutation.mutate({
                userId,
                phoneNumber,
                githubUrl,
                userImageUrl: updatedImageUrl,
                todayCompletedTasksCount,
                currentTask
            }, {
                onSuccess: () => {
                    onClose();
                }
            });
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setUserImage(file);
        }
    };

    const isLoading = updateUserMutation.isPending || uploading;
    const error = updateUserMutation.error || uploadError;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>사용자 정보 수정</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email">이메일 (수정 불가)</Label>
                        <Input
                            id="email"
                            type="email"
                            value={initialEmail}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">전화번호</Label>
                        <Input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="githubUrl">GitHub URL</Label>
                        <Input
                            id="githubUrl"
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="userImage">프로필 이미지</Label>
                        <Input
                            id="userImage"
                            type="file"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="todayCompletedTasksCount">오늘 완료한 작업 수</Label>
                        <Input
                            id="todayCompletedTasksCount"
                            type="number"
                            value={todayCompletedTasksCount}
                            onChange={(e) => setTodayCompletedTasksCount(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currentTask">현재 작업</Label>
                        <Input
                            id="currentTask"
                            type="text"
                            value={currentTask}
                            onChange={(e) => setCurrentTask(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    {error && <p className="text-red-500">Error: {error instanceof Error ? error.message : '업데이트 중 오류가 발생했습니다'}</p>}
                    <DialogFooter>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : '수정'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DialogButtonForUpdateUserInfo;