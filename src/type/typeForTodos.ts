// src/type/typeForTodos.ts

// src/type/typeForTodos.ts

export interface ITodoItem {
    id: number;
    title: string;
    description?: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    day_of_week: number;
    order: number;
    first_menu?: string;
    second_menu?: string;
    status: string;
    status_changed_at: string;
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


export interface IRequestTypeForApiForCreateMultiTodosWithMenuArray {
    first_menu: string; // 1차 메뉴의 이름
    second_menu: string; // 2차 메뉴의 이름
}
