import { useQuery } from '@tanstack/react-query';
import { apiForGetTodoList } from '@/api/apiForTodos';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const useApiForGetTodoList = () => {
    const query = useQuery({
        queryKey: ['todoList'],
        queryFn: apiForGetTodoList,
        retry: 1,
        networkMode: 'always',
    });

    useEffect(() => {
        if (query.error) {
            console.error('Error fetching todo list:', query.error);
            toast.error(`Todo 리스트를 가져오는 중 오류가 발생했습니다: ${query.error.message || '알 수 없는 오류'}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [query.error]);

    return query;
};

export default useApiForGetTodoList;