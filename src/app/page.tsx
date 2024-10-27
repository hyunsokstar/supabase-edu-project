// src/app/page.tsx (또는 src/app/home/page.tsx로 위치 조정 가능)
import LoginUserInfo from '@/components/test/Info/LoginUserInfo';
import ZustandCounter from '@/components/test/ZustandCounter';
import React from 'react';

type Props = {}

const HomePage = (props: Props) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">기본 페이지</h1>

      <div className="bg-white shadow-lg rounded-lg p-4 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">유저 정보</h2>
        <LoginUserInfo />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Zustand Counter</h2>
        <ZustandCounter />
      </div>
    </div>
  );
};

export default HomePage;
