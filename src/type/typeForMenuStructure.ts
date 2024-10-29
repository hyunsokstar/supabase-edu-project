// src/type/typeForMenuStructure.ts

// 메뉴 구조 타입 정의
// src/type/typeForMenuStructure.ts

export interface IMenuStructure {
    id: number;
    menu_structure: any;  // JSONB type
    classification: string | null;
    description: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    users?: {
      email: string;
      profile?: {
        user_image: string;
      };
    };
}


// 단일 메뉴 구조 조회 응답 타입
export interface IResponseSingleMenuStructure {
    success: boolean;
    data: IMenuStructure | null;
    error: string | null;
}

// 메뉴 구조 생성 요청 타입
export interface IRequestParameterForApiForCreateMenuStructure {
    menu_structure: any;
    classification?: string;
    description?: string;
}

// 메뉴 구조 수정 요청 타입
export interface IRequestParameterForApiForUpdateMenuStructure {
    id: number;
    menu_structure?: any;
    classification?: string;
    description?: string;
}
