// src/hooks/useApiForCreateTodo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForCreateTodo } from '@/api/apiForTodos';
import { IRequestParameterForApiForCreateTodo } from '@/type/typeForTodos';
import { toast } from 'react-toastify';

const useApiForCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (todoData: IRequestParameterForApiForCreateTodo) =>
            apiForCreateTodo(todoData),
        onSuccess: () => {
            // Todo 리스트 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['todoList'] });
            toast.success('새 할 일이 성공적으로 추가되었습니다.', {
                position: "top-right",
                autoClose: 3000,
            });
        },
        onError: (error: Error) => {
            console.error('Error creating todo:', error);
            toast.error(`할 일 추가 중 오류가 발생했습니다: ${error.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    });
};

export default useApiForCreateTodo;
