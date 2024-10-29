import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { apiForGetMenuStructureList } from '@/api/apiForMenuAdmin';

const useApiForGetMenuStructureList = () => {
    const { data, isLoading, error, ...query } = useQuery({
        queryKey: ['menuStructureList'],
        queryFn: apiForGetMenuStructureList,
        retry: 1,
        networkMode: 'always',
    });

    useEffect(() => {
        if (error) {
            console.error('Error fetching menu structure list:', error);
            toast.error(`메뉴 구조 리스트를 가져오는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [error]);

    return { data, isLoading, error, ...query };
};

export default useApiForGetMenuStructureList;
