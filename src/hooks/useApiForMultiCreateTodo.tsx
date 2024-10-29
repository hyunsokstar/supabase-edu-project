import { apiForMultiCreateTodosWithMenuArray } from "@/api/apiForTodos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useApiForMultiCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (menuArray: { first_menu: string; second_menu: string }[]) =>
            apiForMultiCreateTodosWithMenuArray(menuArray),
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
};

export default useApiForMultiCreateTodo;