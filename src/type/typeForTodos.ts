export interface ITodoItem {
    id: number;
    user_id: string;
    title: string;
    description: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
}