import { useState } from 'react';
import getSupabase from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

// Presigned URL 가져오기
const fetchPresignedUrl = async (fileName: string, folder: string): Promise<{ signedUrl: string, fileUrl: string }> => {
    const res = await fetch(`/api/get-upload-url?file=${fileName}&folder=${folder}`);
    if (!res.ok) {
        throw new Error('Presigned URL 가져오기 실패');
    }
    const data = await res.json();
    return { signedUrl: data.url, fileUrl: data.fileUrl };
};

// S3로 이미지 업로드
const uploadImageToS3 = async (file: File, signedUrl: string) => {
    const res = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
    });

    if (!res.ok) {
        throw new Error('이미지 업로드 실패');
    }
};

export const useSupabaseForUpdateUserInfoForUserId = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUserInfo = async (
        userId: string,
        phoneNumber: string,
        githubUrl: string,
        userImage: File | null,
        todayCompletedTasksCount: number,
        currentTask: string
    ) => {
        setLoading(true);
        setError(null);

        const supabase = getSupabase();
        if (!supabase) {
            setError('Supabase 초기화 실패');
            setLoading(false);
            return;
        }

        try {
            let userImageUrl = null;
            if (userImage) {
                // 파일 확장자 추출
                const fileExtension = userImage.name.split('.').pop() || 'jpg';
                const fileName = `${userId}-${Date.now()}.${fileExtension}`;

                // Presigned URL 요청
                const { signedUrl, fileUrl } = await fetchPresignedUrl(fileName, 'profiles');
                await uploadImageToS3(userImage, signedUrl); // 이미지 업로드
                userImageUrl = fileUrl; // 업로드된 이미지의 URL 저장
            }

            // public.profile에 데이터 upsert
            const { error: profileError } = await supabase
                .from('profile')
                .upsert({
                    user_id: userId,
                    phone_number: phoneNumber,
                    github_url: githubUrl,
                    user_image: userImageUrl,
                    today_completed_tasks_count: todayCompletedTasksCount,
                    current_task: currentTask,
                }, { onConflict: 'user_id' });

            if (profileError) throw profileError;

            // 성공적으로 업데이트되면 toast 메시지 출력
            toast.success('사용자 정보가 성공적으로 업데이트되었습니다.', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (err: any) {
            console.error('Update error:', err);
            setError(err.message || '알 수 없는 오류가 발생했습니다.');
            toast.error(`업데이트 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`, {
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

    return { updateUserInfo, loading, error };
};