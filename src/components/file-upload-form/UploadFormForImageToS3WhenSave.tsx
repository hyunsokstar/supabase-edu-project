import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X, Download, Eye, ImageIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    onImageSelect: (file: File | null, previewUrl: string) => void;
    width?: number;
    height?: number;
    initialPreviewUrl?: string | null;
    uploadTriggered?: boolean;
}

const isValidImageUrl = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('blob:') || url.startsWith('data:');
};

const UploadFormForImageToS3WhenSave: React.FC<Props> = ({
    onImageSelect,
    width = 100,
    height = 100,
    initialPreviewUrl = '',
    uploadTriggered,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    useEffect(() => {
        if (initialPreviewUrl && isValidImageUrl(initialPreviewUrl)) {
            setPreviewUrl(initialPreviewUrl);
        }
    }, [initialPreviewUrl]);

    const handleFileSelect = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newPreviewUrl = URL.createObjectURL(file);
            if (isValidImageUrl(newPreviewUrl)) {
                setPreviewUrl(newPreviewUrl);
                onImageSelect(file, newPreviewUrl);
                setUploadProgress(0);
            } else {
                toast.error('Invalid image file');
            }
        }
    }, [onImageSelect]);

    const handleDeleteImage = useCallback(() => {
        setPreviewUrl(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageSelect(null, '');
        toast.info('이미지 삭제됨');
    }, [onImageSelect]);

    const handleDownloadImage = useCallback(() => {
        if (previewUrl) {
            const a = document.createElement('a');
            a.href = previewUrl;
            a.download = 'image';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success('다운로드 시작');
        }
    }, [previewUrl]);

    const handlePreviewImage = useCallback(() => {
        if (previewUrl) {
            const newWindow = window.open();
            newWindow?.document.write(`<img src="${previewUrl}" alt="미리보기" style="max-width:100%; max-height:100%;" />`);
        }
    }, [previewUrl]);

    useEffect(() => {
        if (uploadTriggered && previewUrl) {
            setUploadProgress(0);
            const simulateProgress = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(simulateProgress);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 300);
        }
    }, [uploadTriggered, previewUrl]);

    return (
        <>
            <div className="relative h-full flex items-center gap-4 border-2 border-dashed border-gray-300 p-5">
                <div
                    className={`relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-md group`}
                    style={{ width: `${width}px`, height: `${height}px` }}
                >
                    {previewUrl && isValidImageUrl(previewUrl) ? (
                        <>
                            <Image
                                src={previewUrl}
                                alt="미리보기 이미지"
                                width={width}
                                height={height}
                                style={{ objectFit: 'cover' }}
                                className="rounded-md"
                            />
                            {uploadProgress < 100 && uploadTriggered && (
                                <Progress value={uploadProgress} className="absolute bottom-0 w-full" />
                            )}
                            <button
                                onClick={handleDeleteImage}
                                className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <X size={16} />
                            </button>
                            <button
                                onClick={handleDownloadImage}
                                className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full text-white transform translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <Download size={16} />
                            </button>
                            <button
                                onClick={handlePreviewImage}
                                className="absolute bottom-0 left-0 p-1 bg-green-500 rounded-full text-white transform -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <Eye size={16} />
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={24} />
                        </div>
                    )}
                </div>

                <div
                    className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
                    onClick={handleFileSelect}
                >
                    <Plus size={24} className="text-gray-400" />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                accept="image/*"
            />
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </>
    );
};

export default UploadFormForImageToS3WhenSave;
