import { useQuery } from '@tanstack/react-query';
import { apiForGetTodoList } from '@/api/apiForTodos';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const useApiForGetTodoList = () => {
    const { data, isLoading, error, ...query } = useQuery({
        queryKey: ['todoList'],
        queryFn: apiForGetTodoList,
    });

    useEffect(() => {
        if (error) {
            console.error('Error fetching todo list:', error);
            toast.error(`Todo 리스트를 가져오는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [error]);

    return { data, isLoading, error, ...query };
};

export default useApiForGetTodoList;
