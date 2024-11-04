// src/hooks/useApiForUpdateTodoCompletion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForUpdateTodoCompletion } from '@/api/apiForTodos';
import { toast } from 'react-toastify';

const useApiForUpdateTodoCompletionStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ todoId }: { todoId: number }) => apiForUpdateTodoCompletion(todoId),
        onSuccess: () => {
            // 데이터가 성공적으로 업데이트되면, todoList 데이터를 즉시 리패칭
            queryClient.refetchQueries({ queryKey: ['todoList'] });
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

export default useApiForUpdateTodoCompletionStatus;
