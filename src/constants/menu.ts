// src/constants/menu.ts
export type MenuItemType = {
    key: string
    name: string
    hide?: boolean
    items?: {
        key: string
        name: string
        hide?: boolean
        items?: MenuItemType[]
    }[]
}


export const HEADER_MENU_ITEMS: MenuItemType[] = [
    {
        "key": "contents-admin",
        "name": "콘텐츠 관리",
        "items": [
            {
                "key": "teacher-admin",
                "name": "선생님 관리",
                "items": [
                    { "key": "teacher-list", "name": "선생님 목록 조회" },
                    { "key": "teacher-register", "name": "선생님 등록" }
                ]
            },
            {
                "key": "subject-management",
                "name": "과목 관리",
                "items": [
                    { "key": "subject-list", "name": "과목 목록 조회" },
                    { "key": "subject-register", "name": "과목 등록" }
                ]
            },
            {
                "key": "curriculum-admin",
                "name": "커리큘럼 관리",
                "items": [
                    {
                        "key": "lesson-type-admin",
                        "name": "차시 유형 관리",
                        "items": [
                            { "key": "lesson-type-list", "name": "차시 유형 목록 조회" },
                            { "key": "lesson-type-register", "name": "차시 유형 등록" }
                        ]
                    },
                    {
                        "key": "new-curriculum",
                        "name": "신규 커리큘럼",
                        "items": [
                            { "key": "new-curriculum-list", "name": "신규 커리큘럼 목록 조회" },
                            { "key": "curriculum-register", "name": "커리큘럼 등록" },
                            { "key": "lesson-content", "name": "차시 콘텐츠 구성" },
                            { "key": "teacher-comment", "name": "선생님 한마디 구성" },
                            { "key": "operation-exposure", "name": "운영 노출" }
                        ]
                    },
                    { "key": "ongoing-curriculum", "name": "운영 중인 커리큘럼" },
                    { "key": "ended-curriculum", "name": "종료된 커리큘럼" }
                ]
            },
            {
                "key": "content-management",
                "name": "콘텐츠 관리",
                "items": [
                    {
                        "key": "lecture-video",
                        "name": "강의 동영상",
                        "items": [
                            { "key": "lecture-video-list", "name": "강의 동영상 리스트" },
                            { "key": "lecture-video-register", "name": "강의 동영상 등록/수정" }
                        ]
                    },
                    {
                        "key": "evaluation",
                        "name": "평가(문제)",
                        "items": [
                            { "key": "problem-management", "name": "문제 관리" }
                        ]
                    },
                    {
                        "key": "teacher-comment-template",
                        "name": "선생님 한마디 템플릿",
                        "items": [
                            { "key": "teacher-comment-template-register", "name": "선생님 한마디 템플릿 등록/수정" },
                            { "key": "teacher-comment-global-mapping", "name": "선생님 한마디 글로벌 맵핑" }
                        ]
                    }
                ]
            },
            {
                "key": "today-content",
                "name": "오늘의 콘텐츠",
                "items": [
                    {
                        "key": "recommended-content",
                        "name": "추천 콘텐츠",
                        "items": [
                            { "key": "recommended-content-list", "name": "추천 콘텐츠 리스트" },
                            { "key": "recommended-content-register", "name": "추천 콘텐츠 등록/수정" }
                        ]
                    },
                    {
                        "key": "today-quiz",
                        "name": "오늘의 퀴즈",
                        "items": [
                            { "key": "today-quiz-list", "name": "오늘의 퀴즈 리스트" },
                            { "key": "today-quiz-register", "name": "오늘의 퀴즈 등록/수정" }
                        ]
                    },
                    {
                        "key": "resource-content",
                        "name": "자료 콘텐츠",
                        "items": [
                            { "key": "resource-content-list", "name": "자료 콘텐츠 리스트" },
                            { "key": "resource-content-register", "name": "자료 콘텐츠 등록/수정" }
                        ]
                    }
                ]
            }
        ]
    },
]
