// src/store/userStore.ts
import { create } from 'zustand';

interface UserState {
    id: string | null;
    email: string | null;
    isLoggedIn: boolean;
    setUser: (user: { id: string | null; email: string | null }) => void;
    clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
    id: null,
    email: null,
    isLoggedIn: false,
    setUser: (user) =>
        set({
            id: user.id,
            email: user.email,
            isLoggedIn: true,
        }),
    clearUser: () =>
        set({
            id: null,
            email: null,
            isLoggedIn: false,
        }),
}));

export default useUserStore;
