// src\components\Common\CommonOutlinedButton.tsx
import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button"; // shadcn UI의 Button 컴포넌트 import
import { cn } from "@/lib/utils"; // 유틸리티 함수 (shadcn-ui 기본 제공)

interface CommonOutlinedButtonProps extends ButtonProps {
    label?: string; // 버튼의 텍스트 (선택적)
    icon?: React.ReactNode; // 아이콘을 위한 선택적 prop
    iconPosition?: "left" | "right"; // 아이콘의 위치 설정 (왼쪽 또는 오른쪽)
}

const CommonOutlinedButton: React.FC<CommonOutlinedButtonProps> = ({
    label,
    icon,
    iconPosition = "left", // 기본값을 아이콘 왼쪽으로 설정
    variant = "outline", // 기본 스타일을 outline으로 설정
    size = "default",
    className,
    ...props
}) => {
    return (
        <Button
            variant={variant}
            size={size}
            className={cn("flex items-center justify-center", className)} // 아이콘과 텍스트 정렬
            {...props}
        >
            {/* 아이콘이 있을 경우 위치에 따라 렌더링 */}
            {icon && iconPosition === "left" && (
                <span className="mr-2 flex items-center">{icon}</span>
            )}
            {label && <span>{label}</span>}
            {icon && iconPosition === "right" && (
                <span className="ml-2 flex items-center">{icon}</span>
            )}
        </Button>
    );
};

export default CommonOutlinedButton;
