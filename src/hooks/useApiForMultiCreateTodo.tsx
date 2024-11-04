import { apiForMultiCreateTodosWithMenuArray } from "@/api/apiForTodos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";

const useApiForMultiCreateTodo = () => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutation = useMutation({
        // menuJson 타입을 any로 변경하여 전체 메뉴 구조를 받을 수 있도록 함
        mutationFn: async (menuJson: any) => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await apiForMultiCreateTodosWithMenuArray(menuJson);
                if (result.error) throw result.error;
                return result.data;
            } catch (err) {
                setError(err as Error);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        onSuccess: () => {
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