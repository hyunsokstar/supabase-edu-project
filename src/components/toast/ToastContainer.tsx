// C:\new-dankkumi\edu-project\src\components\ToastProvider.tsx
'use client'; // 클라이언트 사이드에서만 동작

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider() {
    return (
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
        />
    );
}
