// src\app\api\get-upload-url\route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';

// 환경 변수 로깅 함수
function logEnvironmentVariables() {
    console.log('Environment Variables:');
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '[REDACTED]' : 'undefined');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '[REDACTED]' : 'undefined');
    console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);
}

// 서버 시작 시 한 번만 로그 출력
logEnvironmentVariables();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    const folder = searchParams.get('folder') || 'uploads';

    if (!fileName) {
        return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    const uniqueFileName = `${folder}/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME || "dankumi-edu-admin-media-storage",
        Key: uniqueFileName,
    });

    try {
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

        console.log('Generated signed URL:', signedUrl);
        console.log('File URL:', fileUrl);

        return NextResponse.json({ url: signedUrl, key: uniqueFileName, fileUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
    }
}