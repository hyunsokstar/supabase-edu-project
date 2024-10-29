// src/type/typeForMenuStructure.ts

// 메뉴 구조 타입 정의
// src/type/typeForMenuStructure.ts

// src/type/typeForMenuStructure.ts

// src/type/typeForMenuStructure.ts

export interface IMenuStructure {
  id: number;
  description: string; // 메뉴 설명
  name?: string; // 메뉴 이름 (optional)
  classification?: string;
  created_at: string;
  updated_at: string;
  items?: IMenuStructure[]; // 하위 메뉴 구조
  users?: {
    profile: {
      user_image: string;
    };
  };
  menu_structure?: any;
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
