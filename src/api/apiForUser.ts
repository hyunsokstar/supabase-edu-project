// C:\new-dankkumi\edu-project\src\lib\apiForUser.ts
import getSupabase from '@/lib/supabaseClient';
import { UpdateUserInfoParams } from '@/type/typeForUser';


export const fetchAllUserList = async () => {
    const supabase = getSupabase();

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

    return data.map((user: any) => ({
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
export const deleteUser = async (userId: string) => {
    const supabase = getSupabase();
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

export const apiForUpdateUserInfo = async ({
    userId,
    phoneNumber,
    githubUrl,
    userImageUrl,
    todayCompletedTasksCount,
    currentTask
}: UpdateUserInfoParams): Promise<string | null> => {
    const supabase = getSupabase();
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