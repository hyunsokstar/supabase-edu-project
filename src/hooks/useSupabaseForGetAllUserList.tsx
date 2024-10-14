// hooks/useSupabaseForGetAllUserList.ts
import { useState, useEffect } from 'react';
import getSupabase from '@/lib/supabaseClient';

type UserProfile = {
    id: string;
    email: string;
    created_at: string;
    user_image: string;
    phone_number: string;
    github_url: string;
    current_task: string;
    today_completed_tasks_count: number;
};

const useSupabaseForGetAllUserList = () => {
    const [employees, setEmployees] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            const supabase = getSupabase();

            if (!supabase) {
                setError('Supabase Client를 초기화할 수 없습니다.');
                setLoading(false);
                return;
            }

            try {
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

                if (error) throw error;

                const formattedData = data.map((user: any) => ({
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at,
                    user_image: user.profile?.user_image || '',
                    phone_number: user.profile?.phone_number || '',
                    github_url: user.profile?.github_url || '',
                    current_task: user.profile?.current_task || '',
                    today_completed_tasks_count: user.profile?.today_completed_tasks_count || 0,
                }));

                setEmployees(formattedData);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return { employees, loading, error };
};

export default useSupabaseForGetAllUserList;