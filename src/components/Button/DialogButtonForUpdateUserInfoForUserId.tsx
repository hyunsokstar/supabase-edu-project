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
    const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const { updateUserInfo, loading, error } = useSupabaseForUpdateUserInfoForUserId();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let updatedImageUrl = null;
            if (userImage && presignedUrl) {
                // Upload the file using presigned URL
                const uploadResponse = await fetch(presignedUrl, {
                    method: 'PUT',
                    body: userImage,
                    headers: {
                        'Content-Type': userImage.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image to S3');
                }

                updatedImageUrl = fileUrl;
            }

            await updateUserInfo(userId, phoneNumber, githubUrl, updatedImageUrl, todayCompletedTasksCount, currentTask);
            onClose();
        } catch (err) {
            console.error('Update failed:', err);
            // 에러 처리 (예: 사용자에게 알림)
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setUserImage(file);

            try {
                const response = await fetch(`/api/get-upload-url?file=${encodeURIComponent(file.name)}&folder=profiles`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('Failed to get presigned URL');
                }

                const { url, fileUrl } = await response.json();
                setPresignedUrl(url);
                setFileUrl(fileUrl);
                console.log('Received presigned URL:', url);
                console.log('File URL:', fileUrl);
            } catch (error) {
                console.error('Error getting presigned URL:', error);
                // 에러 처리 (예: 사용자에게 알림)
            }
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
                        {presignedUrl && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Presigned URL: {presignedUrl}</p>
                                <p className="text-sm text-gray-500">File URL: {fileUrl}</p>
                            </div>
                        )}
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
                    {error && <p className="text-red-500">Error: {error}</p>}
                    <DialogFooter>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : '수정'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DialogButtonForUpdateUserInfoForUserId;
