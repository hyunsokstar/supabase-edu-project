import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import getSupabase from '@/lib/supabaseClient';

interface UpdateUserInfoParams {
    userId: string;
    phoneNumber: string;
    githubUrl: string;
    userImageUrl: string | null;
    todayCompletedTasksCount: number;
    currentTask: string;
}

const useSupabaseForUpdateUserInfo = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({
            userId,
            phoneNumber,
            githubUrl,
            userImageUrl,
            todayCompletedTasksCount,
            currentTask
        }: UpdateUserInfoParams) => {
            const supabase = getSupabase();
            if (!supabase) {
                throw new Error('Supabase 초기화 실패');
            }

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

            if (profileError) {
                throw profileError;
            }

            return userImageUrl;
        },
        onSuccess: () => {
            toast.success('사용자 정보가 성공적으로 업데이트되었습니다.', {
                position: "top-center",
                autoClose: 3000,
            });

            queryClient.refetchQueries({ queryKey: ['allUsers'] });

            // 관련된 쿼리 무효화
            // queryClient.invalidateQueries({
            //     queryKey: ['userProfile'],
            // });
        },
        onError: (error: Error) => {
            console.error('Update error:', error);
            toast.error(`업데이트 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`, {
                position: "top-right",
                autoClose: 3000,
            });
        },
    });

    return mutation;
};

export default useSupabaseForUpdateUserInfo;