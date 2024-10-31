import { getSupabase } from '@/lib/supabaseClient';
import useUserStore from '@/store/userStore';
import { IRequestParameterForApiForCreateTodo, ITodoItem } from '@/type/typeForTodos';

export const apiForUpdateTodoCompletion = async (todoId: number, isCompleted: boolean): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) {
        console.error("Supabase 클라이언트 초기화 실패");
        return false;
    }
    try {
        const { error } = await supabase
            .from('todos')
            .update({ is_completed: isCompleted })
            .eq('id', todoId);
        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error("todo 완료 상태 업데이트 실패: ", error);
        return false;
    }
};

export const apiForMultiCreateTodosWithMenuArray = async (
    menuArray: { first_menu: string; second_menu: string }[]
) => {
    const supabase = getSupabase();
    const userStore = useUserStore.getState();

    // 현재 로그인된 사용자 ID 가져오기
    const userId = userStore?.id;
    if (!userId) {
        console.error("사용자 ID를 찾을 수 없습니다. 로그인이 필요합니다.");
        return { error: "사용자 인증 실패" };
    }

    // 트랜잭션 시작
    try {
        // 1. 먼저 현재 사용자의 모든 todo 삭제
        const { error: deleteError } = await supabase
            .from('todos')
            .delete()
            .eq('user_id', userId);

        if (deleteError) {
            console.error('기존 할 일들을 삭제하는 중 오류가 발생했습니다:', deleteError);
            return { error: deleteError };
        }

        console.log('기존 할 일들이 성공적으로 삭제되었습니다.');

        // 2. 새로운 todo 항목들 추가
        const todosToInsert = menuArray.map((menu) => ({
            user_id: userId,
            first_menu: menu.first_menu,
            second_menu: menu.second_menu,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
        }));

        const { data: insertedData, error: insertError } = await supabase
            .from('todos')
            .insert(todosToInsert)
            .select();

        if (insertError) {
            console.error('새로운 할 일들을 추가하는 중 오류가 발생했습니다:', insertError);
            return { error: insertError };
        }

        console.log('성공적으로 새로운 할 일들이 추가되었습니다:', insertedData);
        return { data: insertedData, error: null };

    } catch (err) {
        console.error('API 요청 중 오류가 발생했습니다:', err);
        return { error: err };
    }
};

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
            is_completed,
            status_changed_at,
            users (
                email,
                profile (
                    user_image
                )
            )
        `)
        .order('first_menu', { ascending: true })
        .order('order', { ascending: true });

    if (error) {
        throw new Error(`Todo 리스트를 불러오는 중 오류가 발생했습니다: ${error.message}`);
    }

    console.log("Raw data from Supabase:", data);

    return data as unknown as ITodoItem[];
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

