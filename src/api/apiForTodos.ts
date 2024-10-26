// src/api/apiForTodos.ts
import getSupabase from '@/lib/supabaseClient';
import { ITodoItem } from '@/type/typeForTodos';


// Todo 리스트를 가져오는 함수
export const apiForGetTodoList = async (): Promise<ITodoItem[]> => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false }); // 최신순으로 정렬 (옵션에 따라 변경 가능)

    if (error) {
        throw new Error(`Todo 리스트를 불러오는 중 오류가 발생했습니다: ${error.message}`);
    }

    return data as ITodoItem[];
};
