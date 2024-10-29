// src/type/typeForTodos.ts

// 개별 Todo 아이템 타입
export interface ITodoItem {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean; // 완료 여부 필드 추가
    created_at: string;
    updated_at: string;
    user_id: string;
    day_of_week: number;
    order: number;
    first_menu?: string;
    second_menu?: string;
    status_changed_at?: string; // 상태 변경 날짜 필드 유지 (필요 시)
    users: {
        email: string;
        profile: {
            user_image: string;
        };
    };
}

// 새로운 Todo 생성 시 필요한 요청 파라미터 타입
export interface IRequestParameterForApiForCreateTodo {
    title: string;
    description: string;
    is_completed: boolean; // 완료 여부 추가
    userId: string; // 현재 로그인된 사용자의 ID
}

// 다중 Todo 생성 시 메뉴 배열을 포함하는 요청 타입
export interface IRequestTypeForApiForCreateMultiTodosWithMenuArray {
    first_menu: string; // 1차 메뉴의 이름
    second_menu: string; // 2차 메뉴의 이름
}
