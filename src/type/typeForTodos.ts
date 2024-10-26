// src/type/typeForTodos.ts

export interface ITodoItem {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
    user_id: string;
    users: {
        email: string;
        profile: {
            user_image: string;
        };
    };
}
