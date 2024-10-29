// src/api/apiForTodos.ts
import getSupabase from '@/lib/supabaseClient';
import { IRequestParameterForApiForCreateTodo, IRequestTypeForApiForCreateMultiTodosWithMenuArray } from '@/type/typeForTodos';
import useUserStore from '@/store/userStore';

// apiForCreateMultiTodosWithMenuArray
export const apiForCreateMultiTodosWithMenuArray = async (
    request: Omit<IRequestTypeForApiForCreateMultiTodosWithMenuArray, 'userId'>[]
  ) => {
    const supabase = getSupabase();
    const userStore = useUserStore.getState();

    console.log("request : ", request);
    

    // 사용자 ID가 없는 경우 예외 처리
    if (!userStore.id) {
      throw new Error('로그인된 사용자를 찾을 수 없습니다.');
    }
  
    // 요청에 사용자 ID 추가
    const requestWithUserId = request.map((req) => ({
      ...req,
      user_id: userStore.id,
    }));
  
    // 데이터 삽입
    const { data, error } = await supabase.from('todos').insert(requestWithUserId);
    if (error) {
      throw new Error(`Failed to insert todos: ${error.message}`);
    }
    
    // 삽입된 데이터 로그로 확인
    console.log('삽입된 데이터:', data);

    return data;
  };


export const apiForCreateTodo = async (todo: IRequestParameterForApiForCreateTodo): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

    // 현재 세션의 사용자 ID를 가져옴
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('로그인된 사용자가 없습니다.');
    }

    const userId = user.user?.id;

    const { error } = await supabase
        .from('todos')
        .insert({
            title: todo.title,
            description: todo.description,
            is_completed: todo.is_completed,
            user_id: userId, // user_id를 명시적으로 설정
        });

    if (error) {
        throw new Error(`Todo 추가 중 오류가 발생했습니다: ${error.message}`);
    }
};




// todo 삭제 with id
export const apiForDeleteTodo = async (todoId: number): Promise<void> => {
    console.log("todoId:", todoId);

    const supabase = getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

    // Supabase의 RLS 정책이 삭제 권한을 처리하므로 추가적인 확인이 필요하지 않음
    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId)
        .select(); // 삭제된 데이터를 반환하여 실제 삭제 여부 확인

    if (error) {
        console.error('Error deleting todo:', error);
        throw new Error(`Todo 삭제 중 오류가 발생했습니다: ${error.message}`);
    }

    // 삭제된 데이터가 없으면 권한이 없는 것임
    if (!data || data.length === 0) {
        throw new Error('이 Todo를 삭제할 권한이 없거나 존재하지 않는 Todo입니다.');
    }

    console.log("Todo successfully deleted:", data);
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
            created_at,
            updated_at,
            user_id,
            day_of_week,
            order,
            first_menu,
            second_menu,
            status,
            status_changed_at,
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

    console.log("Raw data from Supabase:", data);

    return data as unknown as ITodoItem[];
};
