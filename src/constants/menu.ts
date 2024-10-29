// src/constants/menu.ts

export interface MenuItemType {
    key: string;
    name: string;
    items?: MenuItemType[];
}

export const HEADER_MENU_ITEMS: MenuItemType[] = [
    {
        key: "menu-admin",
        name: "메뉴 관리",
        items: [
            { key: "menu-list", name: "메뉴 리스트", items: [] },
            { key: "menu-update", name: "메뉴 등록/수정", items: [] }
        ]
    },
    {
        key: "todo-management",
        name: "Todo 관리",
        items: [
            {
                key: "todo-dashboard",
                name: "대시보드",
                items: [
                    { key: "all-tasks", name: "모든 작업 보기" },
                    { key: "my-tasks", name: "내 작업" },
                    { key: "team-tasks", name: "팀 작업" }
                ]
            },
            {
                key: "task-creation",
                name: "작업 생성",
                items: [
                    { key: "new-task", name: "새 작업 추가" },
                    { key: "task-template", name: "작업 템플릿" }
                ]
            },
            {
                key: "task-management",
                name: "작업 관리",
                items: [
                    { key: "in-progress-tasks", name: "진행 중인 작업" },
                    { key: "completed-tasks", name: "완료된 작업" },
                    { key: "overdue-tasks", name: "기한이 지난 작업" }
                ]
            },
            {
                key: "team-management",
                name: "팀 관리",
                items: [
                    { key: "team-overview", name: "팀 개요" },
                    { key: "team-members", name: "팀 멤버 관리" },
                    { key: "permissions", name: "권한 관리" }
                ]
            }
        ]
    },
    {
        key: "note-management",
        name: "노트 관리",
        items: [
            {
                key: "note-dashboard",
                name: "노트 대시보드",
                items: [
                    { key: "all-notes", name: "모든 노트 보기" },
                    { key: "my-notes", name: "내 노트" },
                    { key: "shared-notes", name: "공유된 노트" }
                ]
            },
            {
                key: "note-creation",
                name: "노트 생성",
                items: [
                    { key: "new-note", name: "새 노트 작성" },
                    { key: "note-template", name: "노트 템플릿" }
                ]
            },
            {
                key: "note-management",
                name: "노트 관리",
                items: [
                    { key: "recent-notes", name: "최근 노트" },
                    { key: "archived-notes", name: "보관된 노트" },
                    { key: "deleted-notes", name: "삭제된 노트" }
                ]
            },
            {
                key: "collaboration",
                name: "협업",
                items: [
                    { key: "shared-notes-overview", name: "공유 노트 개요" },
                    { key: "permissions", name: "공유 권한 관리" }
                ]
            }
        ]
    },
    {
        key: "hr-management",
        name: "인사 관리",
        items: [
            {
                key: "employee-management",
                name: "직원 관리",
                items: [
                    { key: "employee-list", name: "직원 목록" },
                    { key: "employee-profile", name: "직원 프로필" }
                ]
            },
            {
                key: "attendance-management",
                name: "근태 관리",
                items: [
                    { key: "attendance-overview", name: "근태 개요" },
                    { key: "attendance-report", name: "근태 보고서" }
                ]
            },
            {
                key: "leave-management",
                name: "휴가 관리",
                items: [
                    { key: "leave-overview", name: "휴가 개요" },
                    { key: "leave-request", name: "휴가 신청" }
                ]
            },
            {
                key: "payroll-management",
                name: "급여 관리",
                items: [
                    { key: "payroll-overview", name: "급여 개요" },
                    { key: "payroll-report", name: "급여 보고서" }
                ]
            }
        ]
    }
];


