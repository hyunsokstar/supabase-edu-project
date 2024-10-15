export async function uploadImageToS3(file: File, signedUrl: string): Promise<boolean> {
    console.log("Attempting to upload file to:", signedUrl);
    console.log("File name:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size, "bytes");
    // src\lib\uploadImageToS3.ts

    try {
        console.log("Starting fetch request...");
        const response = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        });

        console.log("Fetch request completed. Status:", response.status);
        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (!response.ok) {
            console.error('S3 upload failed:', response.status, response.statusText, responseText);
            throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
        }

        // 응답이 비어있어도 성공으로 간주할 수 있지만, 확실히 하기 위해 추가 검증
        if (responseText.trim() === '' && response.status === 200) {
            console.log('S3 upload successful (empty response)');
            return true;
        } else if (responseText.includes("uploadResult")) {
            console.log('S3 upload successful with response');
            return true;
        } else {
            console.warn('Unexpected response from S3:', responseText);
            return false;
        }


    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error;
    }
}