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
import { useSupabaseForUpdateUserInfoForUserId } from '@/hooks/useSupabaseForUpdateUserInfoForUserId';
import { useImageUpload } from '@/hooks/useImageUploadToS3';

interface DialogButtonForUpdateUserInfoForUserIdProps {
    userId: string;
    initialEmail: string;
    initialPhoneNumber: string;
    initialGithubUrl: string;
    initialUserImage: string;
    initialTodayCompletedTasksCount: number;
    initialCurrentTask: string;
    onClose: () => void;
}

const DialogButtonForUpdateUserInfoForUserId: React.FC<DialogButtonForUpdateUserInfoForUserIdProps> = ({
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

    const { updateUserInfo, loading: updating, error: updateError } = useSupabaseForUpdateUserInfoForUserId();
    const { uploadImage, loading: uploading, error: uploadError } = useImageUpload();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let updatedImageUrl = null;
            if (userImage) {
                // 이미지 업로드 처리
                const imageUrl = await uploadImage(userImage, 'profiles');
                if (imageUrl) {
                    updatedImageUrl = imageUrl;
                }
            }

            // 사용자 정보 업데이트 처리
            await updateUserInfo(userId, phoneNumber, githubUrl, updatedImageUrl, todayCompletedTasksCount, currentTask);
            onClose();
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
                    {(uploadError || updateError) && <p className="text-red-500">Error: {uploadError || updateError}</p>}
                    <DialogFooter>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            disabled={updating || uploading}
                        >
                            {(updating || uploading) ? <Loader2 className="animate-spin" /> : '수정'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DialogButtonForUpdateUserInfoForUserId;
