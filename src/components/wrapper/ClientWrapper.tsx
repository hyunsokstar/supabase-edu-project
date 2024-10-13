// C:\new-dankkumi\edu-project\src\components\ClientWrapper.tsx
'use client';

import dynamic from "next/dynamic";

// 동적 로드: 클라이언트 전용으로 렌더링할 컴포넌트들
const DynamicToastProvider = dynamic(() => import('../toast/ToastContainer'), { ssr: false });
const DynamicHeaderMenus = dynamic(() => import('../HeaderMenusForDankkumEduProject'), { ssr: false });

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DynamicToastProvider />
            <DynamicHeaderMenus />
            <div>
                hi
            </div>
            {children}
        </>
    );
}
