import { useState } from 'react';
import getSupabase from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

export const useSupabaseForUpdateUserInfoForUserId = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUserInfo = async (
        userId: string,
        phoneNumber: string,
        githubUrl: string,
        userImageUrl: string | null,
        todayCompletedTasksCount: number,
        currentTask: string
    ) => {
        setLoading(true);
        setError(null);

        const supabase = getSupabase();
        if (!supabase) {
            setError('Supabase 초기화 실패');
            setLoading(false);
            return null;
        }

        try {
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

            toast.success('사용자 정보가 성공적으로 업데이트되었습니다.');

            return userImageUrl;
        } catch (err: any) {
            console.error('Update error:', err);
            setError(err.message || '알 수 없는 오류가 발생했습니다.');
            toast.error(`업데이트 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateUserInfo, loading, error };
};