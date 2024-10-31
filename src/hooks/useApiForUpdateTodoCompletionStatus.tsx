// src/hooks/useApiForUpdateTodoCompletion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForUpdateTodoCompletion } from '@/api/apiForTodos';
import { toast } from 'react-toastify';

const useApiForUpdateTodoCompletion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ todoId, isCompleted }: { todoId: number, isCompleted: boolean }) =>
            apiForUpdateTodoCompletion(todoId, isCompleted),
        onSuccess: () => {
            // Todo 리스트 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['todoList'] });
            toast.success('할 일의 완료 상태가 성공적으로 업데이트되었습니다.', {
                position: "top-right",
                autoClose: 3000,
            });
        },
        onError: (error: Error) => {
            console.error('Error updating todo completion status:', error);
            toast.error(`할 일 완료 상태 업데이트 중 오류가 발생했습니다: ${error.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    });
};

export default useApiForUpdateTodoCompletion;
