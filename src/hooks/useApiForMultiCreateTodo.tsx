import { apiForMultiCreateTodosWithMenuArray } from "@/api/apiForTodos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";

const useApiForMultiCreateTodo = () => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutation = useMutation({
        mutationFn: async (menuArray: { first_menu: string; second_menu: string }[]) => {
            setIsLoading(true);
            setError(null);
            try {
                await apiForMultiCreateTodosWithMenuArray(menuArray);
            } catch (err) {
                setError(err as Error);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        onSuccess: () => {
            // Todo 리스트 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['todoList'] });
            toast.success('새 할 일들이 성공적으로 추가되었습니다.', {
                position: "top-right",
                autoClose: 3000,
            });
        },
        onError: (error: Error) => {
            console.error('할 일 추가 중 오류가 발생했습니다:', error);
            toast.error(`할 일 추가 중 오류가 발생했습니다: ${error.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    });

    return { ...mutation, isLoading, error };
};

export default useApiForMultiCreateTodo;