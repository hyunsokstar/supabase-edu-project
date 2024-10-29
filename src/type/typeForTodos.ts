// src/type/typeForTodos.ts

export interface ITodoItem {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
    user_id: string;
    day_of_week: number;
    order: number;
    users: {
        email: string;
        profile: {
            user_image: string;
        };
    };
}


// src/type/typeForTodos.ts
export interface IRequestParameterForApiForCreateTodo {
    title: string;
    description: string;
    is_completed: boolean;
    userId: string; // 현재 로그인된 사용자의 ID
}
