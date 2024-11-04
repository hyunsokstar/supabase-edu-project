// src/hooks/useApiForDeleteTodo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForDeleteTodo } from '@/api/apiForTodos';
import { toast } from 'react-toastify';

const useApiForDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiForDeleteTodo,
        onSuccess: () => {
            // Todo 리스트 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['todoList'] });
            toast.success('Todo가 성공적으로 삭제되었습니다.', {
                position: "top-right",
                autoClose: 3000,
            });
        },
        onError: (error: Error) => {
            console.error('Error deleting todo:', error);
            toast.error(`Todo 삭제 중 오류가 발생했습니다: ${error.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    });
};

export default useApiForDeleteTodo;