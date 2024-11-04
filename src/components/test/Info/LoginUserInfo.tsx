// src/components/LoginUserInfo.tsx
"use client";

import React from 'react';
import useUserStore from '@/store/userStore';

const LoginUserInfo: React.FC = () => {
    const { isLoggedIn, email, id } = useUserStore();

    return (
        <div className="user-info mt-4">
            {isLoggedIn ? (
                <>
                    <h2>로그인 정보</h2>
                    <p>이메일: {email}</p>
                    <p>ID: {id}</p>
                </>
            ) : (
                <p>로그인되지 않았습니다.</p>
            )}
        </div>
    );
};

export default LoginUserInfo;
