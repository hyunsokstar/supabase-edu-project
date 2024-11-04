import { getSupabase } from '@/lib/supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';
import useUserStore from '@/store/userStore';
import { IRequestParameterForApiForCreateTodo, ITodoItem } from '@/type/typeForTodos';

// Todo 완료 상태 업데이트 API
export const apiForUpdateTodoCompletion = async (todoId: number, isCompleted: boolean): Promise<boolean> => {
    const supabase = await getSupabase();
    if (!supabase) {
        console.error("Supabase 클라이언트 초기화 실패");
        return false;
    }

    console.log("isCompleted check at apiForUpdateTodoCompletion : ", isCompleted);

    try {
        const { data: updatedTodo, error: updateError }: { data: any, error: PostgrestError | null } = await supabase
            .from('todos')
            .update({ is_completed: isCompleted })
            .eq('id', todoId)
            .select('is_completed')
            .single();

        if (updateError) {
            throw updateError;
        }

        console.log(`Todo ID ${todoId}의 새로운 완료 상태:`, updatedTodo?.is_completed);
        return true;
    } catch (error) {
        console.error("todo 완료 상태 업데이트 실패 발생: ", error);
        return false;
    }
};

// 메뉴 구조에서 1차, 2차 메뉴를 추출하는 함수
const extractMenuArray = (menu: any): { first_menu: string; second_menu: string }[] => {
    let result: { first_menu: string; second_menu: string }[] = [];

    const processMenu = (item: any) => {
        if (item.items && Array.isArray(item.items)) {
            item.items.forEach((subItem: any) => {
                if (subItem.items && Array.isArray(subItem.items)) {
                    processMenu(subItem);
                } else {
                    result.push({
                        first_menu: menu.name,
                        second_menu: subItem.name
                    });
                }
            });
        }
    };

    if (menu.items && Array.isArray(menu.items)) {
        menu.items.forEach((item: any) => {
            processMenu(item);
        });
    }

    console.log("Extracted menu array:", result); // 디버깅용 로그
    return result;
};

// 여러 Todos 생성 API
export const apiForMultiCreateTodosWithMenuArray = async (menuJson: any) => {
    const supabase = await getSupabase();
    const userStore = useUserStore.getState();

    const userId = userStore?.id;
    if (!userId) {
        console.error("사용자 ID를 찾을 수 없습니다. 로그인이 필요합니다.");
        return { error: "사용자 인증 실패" };
    }

    try {
        const { error: deleteError } = await supabase
            .from('todos')
            .delete()
            .eq('user_id', userId);

        if (deleteError) {
            console.error('기존 할 일들을 삭제하는 중 오류가 발생했습니다:', deleteError);
            return { error: deleteError };
        }

        const menuArray = extractMenuArray(menuJson);
        console.log('변환된 메뉴 구조:', menuArray);

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

        console.log('성공적으로 추가된 데이터:', insertedData);
        return { data: insertedData, error: null };

    } catch (err) {
        console.error('API 요청 중 오류가 발생했습니다:', err);
        return { error: err };
    }
};

// Todo 리스트 조회 API
export const apiForGetTodoList = async (): Promise<ITodoItem[]> => {
    const supabase = await getSupabase();
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
        .order('first_menu', { ascending: true })  // 먼저 first_menu로 정렬
        .order('order', { ascending: true })       // 그 다음 order로 정렬
        .order('id', { ascending: true });         // 마지막으로 id로 정렬

    if (error) {
        throw new Error(`Todo 리스트를 불러오는 중 오류가 발생했습니다: ${error.message}`);
    }

    console.log("Raw data from Supabase:", data);

    return data as unknown as ITodoItem[];
};

// Todo 생성 API
export const apiForCreateTodo = async (todo: IRequestParameterForApiForCreateTodo): Promise<void> => {
    const supabase = await getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

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
            user_id: userId,
        });

    if (error) {
        throw new Error(`Todo 추가 중 오류가 발생했습니다: ${error.message}`);
    }
};

// Todo 삭제 API
export const apiForDeleteTodo = async (todoId: number): Promise<void> => {
    console.log("todoId:", todoId);

    const supabase = await getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId)
        .select();

    if (error) {
        console.error('Error deleting todo:', error);
        throw new Error(`Todo 삭제 중 오류가 발생했습니다: ${error.message}`);
    }

    if (!data || data.length === 0) {
        throw new Error('이 Todo를 삭제할 권한이 없거나 존재하지 않는 Todo입니다.');
    }

    console.log("Todo successfully deleted:", data);
};
