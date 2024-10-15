// C:\new-dankkumi\edu-project\src\hooks\useApiForDeleteUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteUser } from '@/api/apiForUser';

const useApiForDeleteUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<{ message: string }, Error, string>({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: (data) => {
            // 사용자 목록을 다시 불러와서 UI 갱신
            // queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            queryClient.refetchQueries({ queryKey: ['allUsers'] });


            // 성공 메시지 출력
            toast.success(data.message, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        },
        onError: (error: Error) => {
            // 오류 메시지 출력
            console.error('Error deleting user: ', error);
            toast.error(`사용자 삭제 중 오류가 발생했습니다: ${error.message}`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        },
    });

    return mutation;
};

export default useApiForDeleteUser;
