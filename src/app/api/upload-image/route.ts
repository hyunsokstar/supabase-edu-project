import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export async function POST(req: NextRequest) {
    console.log('업로드 요청 수신');

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) {
            console.error('파일이 업로드되지 않음');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log('파일 수신:', file.name, file.type, file.size);

        const buffer = await file.arrayBuffer();
        const fileName = `${Date.now()}-${file.name}`;

        console.log('S3 업로드 시도:', fileName);

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `profiles/${fileName}`,
            Body: Buffer.from(buffer),
            ContentType: file.type,
        });

        const uploadResult = await s3Client.send(command);

        console.log('S3 업로드 결과:', uploadResult);

        if (uploadResult.$metadata.httpStatusCode === 200) {
            const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profiles/${fileName}`;
            console.log('파일 업로드 성공:', fileUrl);
            return NextResponse.json({
                message: 'File uploaded successfully',
                fileUrl: fileUrl,
            });
        } else {
            console.error('업로드 실패:', uploadResult);
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('S3 업로드 중 오류:', error);
        return NextResponse.json({ error: 'File upload failed', details: (error as Error).message }, { status: 500 });
    }
}