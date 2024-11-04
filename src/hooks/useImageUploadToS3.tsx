import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';


interface UseImageUploadResult {
    uploadImage: (file: File, folder: string) => Promise<string | null>;
    loading: boolean;
    error: string | null;
}

export const useImageUpload = (): UseImageUploadResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();


    const uploadImage = async (file: File, folder: string): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            // presigned URL 요청
            const response = await fetch(`/api/get-upload-url?file=${encodeURIComponent(file.name)}&folder=${folder}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to get presigned URL');
            }

            const { url, fileUrl } = await response.json();

            // presigned URL로 파일 업로드
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image to S3');
            }

            // allUsers
            // tanstack/react-query

            // 파일이 성공적으로 업로드되면 fileUrl 반환
            return fileUrl;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error uploading image');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { uploadImage, loading, error };
};
