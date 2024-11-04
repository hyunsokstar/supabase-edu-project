// src/lib/apiForUser.ts
import getSupabase from '@/lib/supabaseClient';
import { IUserRow, UpdateUserInfoParams } from '@/type/typeForUser';

// 모든 사용자 목록을 가져오는 API
export const fetchAllUserList = async (): Promise<IUserRow[]> => {
    const supabase = await getSupabase();
    if (!supabase) {
        throw new Error('Supabase Client를 초기화할 수 없습니다.');
    }

    const { data, error } = await supabase
        .from('users')
        .select(`
            id, 
            email, 
            created_at,
            profile (
                user_image,
                phone_number,
                github_url,
                current_task,
                today_completed_tasks_count
            )
        `);

    if (error) {
        throw error;
    }

    // 데이터 매핑 후 IUserRow[] 형태로 반환
    return (data as any[]).map((user): IUserRow => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        user_image: user.profile?.user_image || '',
        phone_number: user.profile?.phone_number || '',
        github_url: user.profile?.github_url || '',
        current_task: user.profile?.current_task || '',
        today_completed_tasks_count: user.profile?.today_completed_tasks_count || 0,
    }));
};

// 사용자 삭제 API 로직 추가
export const deleteUser = async (userId: string): Promise<{ message: string }> => {
    const supabase = await getSupabase();
    if (!supabase) {
        throw new Error('Supabase Client를 초기화할 수 없습니다.');
    }

    const { error } = await supabase.auth.admin.deleteUser(userId); // auth.users 삭제
    if (error) {
        throw error;
    }

    const { error: profileError } = await supabase
        .from('profile')
        .delete()
        .eq('user_id', userId); // profile 테이블에서 사용자 삭제

    if (profileError) {
        throw profileError;
    }

    return { message: 'User successfully deleted' };
};

// 사용자 정보를 업데이트하는 API 로직
export const apiForUpdateUserInfo = async ({
    userId,
    phoneNumber,
    githubUrl,
    userImageUrl,
    todayCompletedTasksCount,
    currentTask
}: UpdateUserInfoParams): Promise<string | null> => {
    const supabase = await getSupabase();
    if (!supabase) {
        throw new Error('Supabase 초기화 실패');
    }

    const { error: profileError } = await supabase
        .from('profile')
        .upsert({
            user_id: userId,
            phone_number: phoneNumber,
            github_url: githubUrl,
            user_image: userImageUrl,
            today_completed_tasks_count: todayCompletedTasksCount,
            current_task: currentTask,
        }, { onConflict: 'user_id' });

    if (profileError) {
        throw profileError;
    }

    return userImageUrl;
};
