// C:\new-dankkumi\edu-project\src\hooks\useSupabaseForGetAllUserList.ts
import { fetchAllUserList } from '@/api/apiForUser';
import { IUserRow } from '@/type/typeForUser';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';


export const useSupabaseForGetAllUserList = (
    options?: Omit<UseQueryOptions<IUserRow[], Error, IUserRow[], string[]>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<IUserRow[], Error, IUserRow[], string[]>({
        queryKey: ['allUsers'],
        queryFn: fetchAllUserList,
        staleTime: 1000 * 60 * 5, // 5분 동안 캐시된 데이터를 유지
        ...options,
    });
};