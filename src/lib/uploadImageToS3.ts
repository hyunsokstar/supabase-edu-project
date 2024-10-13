// src/lib/uploadImageToS3.ts
// S3 Presigned URL로 파일 업로드하는 함수

export async function uploadImageToS3(file: File, signedUrl: string): Promise<void> {
    try {
        // Presigned URL로 파일 업로드
        await fetch(signedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type, // 파일의 MIME 타입 설정
            },
            body: file, // 파일을 바디에 넣어 전송
        });
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw new Error('이미지 업로드 중 오류가 발생했습니다.');
    }
}
