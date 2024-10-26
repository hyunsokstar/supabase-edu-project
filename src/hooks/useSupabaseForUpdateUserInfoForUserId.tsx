import { apiForUpdateUserInfo } from '@/api/apiForUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

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
        mutationFn: apiForUpdateUserInfo,  // apiForUpdateUserInfo를 호출하도록 수정
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
