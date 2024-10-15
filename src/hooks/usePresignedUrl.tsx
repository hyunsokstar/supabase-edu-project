// hooks/usePresignedUrl.tsx

import { useState } from 'react';

export const usePresignedUrl = () => {
    const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getPresignedUrl = async (fileName: string, folder: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/get-upload-url?file=${encodeURIComponent(fileName)}&folder=${folder}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to get presigned URL');
            }

            const { url, fileUrl } = await response.json();
            setPresignedUrl(url);
            setFileUrl(fileUrl);
        } catch (error: any) {
            setError(error.message || 'Error getting presigned URL');
        } finally {
            setLoading(false);
        }
    };

    return { presignedUrl, fileUrl, loading, error, getPresignedUrl };
};
