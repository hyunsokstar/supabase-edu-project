// src/api/apiForTodos.ts
import getSupabase from '@/lib/supabaseClient';
import { IRequestParameterForApiForCreateTodo } from '@/type/typeForTodos';

export const apiForCreateTodo = async (todo: IRequestParameterForApiForCreateTodo): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

    const { error } = await supabase
        .from('todos')
        .insert({
            title: todo.title,
            description: todo.description,
            is_completed: todo.is_completed,
            user_id: todo.userId, // 현재 로그인 유저의 ID를 설정
        });

    if (error) {
        throw new Error(`Todo 추가 중 오류가 발생했습니다: ${error.message}`);
    }
};


// todo 리스트 조회
export const apiForGetTodoList = async (): Promise<ITodoItem[]> => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

    const { data, error } = await supabase
        .from('todos')
        .select(`
            id,
            title,
            description,
            is_completed,
            created_at,
            updated_at,
            user_id,
            users (
                email,
                profile (
                    user_image
                )
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Todo 리스트를 불러오는 중 오류가 발생했습니다: ${error.message}`);
    }

    // 원본 데이터를 콘솔에 출력
    console.log("Raw data from Supabase:", data);

    // 일단 원본 데이터를 그대로 반환하여 확인
    return data as unknown as ITodoItem[];
};

// todo 삭제 with id
export const apiForDeleteTodo = async (todoId: number): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId);

    if (error) {
        throw new Error(`Todo 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
};
