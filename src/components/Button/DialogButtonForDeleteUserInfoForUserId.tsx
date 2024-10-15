// src/components/Button/DialogButtonForDeleteUserInfoForUserId.tsx
"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface DialogButtonForDeleteUserInfoForUserIdProps {
    userId: string;
    userEmail: string;
    onClose: () => void;
}

const DialogButtonForDeleteUserInfoForUserId: React.FC<DialogButtonForDeleteUserInfoForUserIdProps> = ({
    userId,
    userEmail,
    onClose,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteUser = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/delete-user', {
                method: 'POST', // DELETE -> POST로 변경
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error(`Failed to delete user: ${response.statusText}`);
            }

            const data = await response.json();
            toast.success(data.message, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // 다이얼로그 닫기
            onClose();
        } catch (err: any) {
            console.error('Delete error:', err);
            setError(err.message || '알 수 없는 오류가 발생했습니다.');
            toast.error(`삭제 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>사용자 정보 삭제</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>정말로 사용자의 정보를 삭제하시겠습니까?</p>
                    <p className="font-bold">{userEmail}</p>
                    {error && <p className="text-red-500">Error: {error}</p>}
                </div>
                <DialogFooter>
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                        onClick={handleDeleteUser}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : '삭제'}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DialogButtonForDeleteUserInfoForUserId;
