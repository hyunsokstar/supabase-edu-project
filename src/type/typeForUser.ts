export type IUserRow = {
    id: string;
    email: string;
    created_at: string;
    user_image: string;
    phone_number: string;
    github_url: string;
    current_task: string;
    today_completed_tasks_count: number;
};

export interface UpdateUserInfoParams {
    userId: string;
    phoneNumber: string;
    githubUrl: string;
    userImageUrl: string | null;
    todayCompletedTasksCount: number;
    currentTask: string;
}

// src/type/typeForUser.ts
export interface UserProfile {
    user_image?: string;
    phone_number?: string;
    github_url?: string;
    current_task?: string;
    today_completed_tasks_count?: number;
}

export interface User {
    id: string;
    email: string;
    created_at: string;
    profile?: UserProfile;
}
