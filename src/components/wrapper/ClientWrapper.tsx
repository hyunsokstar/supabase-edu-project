// C:\new-dankkumi\edu-project\src\components\ClientWrapper.tsx
'use client';

import dynamic from "next/dynamic";
import MenuPathIndicator from "../Common/MenuPathIndicator";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// 동적 로드: 클라이언트 전용으로 렌더링할 컴포넌트들
const DynamicToastProvider = dynamic(() => import('../toast/ToastContainer'), { ssr: false });
const DynamicHeaderMenus = dynamic(() => import('../HeaderMenusForDankkumEduProject'), { ssr: false });

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient()); // React QueryClient 초기화

    return (
        <QueryClientProvider client={queryClient}> {/* React Query Provider로 감싸기 */}
            <DynamicToastProvider />
            <DynamicHeaderMenus />
            <div className="">
                <MenuPathIndicator />
            </div>
            {children}
        </QueryClientProvider>
    );
}
