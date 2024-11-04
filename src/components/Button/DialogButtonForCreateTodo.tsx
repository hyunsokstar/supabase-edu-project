// src/components/DialogButtonForCreateTodo.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import useApiForCreateTodo from "@/hooks/useApiForCreateTodo";
import useUserStore from "@/store/userStore"; // Zustand 스토어에서 유저 정보 가져오기

interface TodoForm {
    title: string;
    description: string;
    is_completed: boolean;
}

export default function DialogButtonForCreateTodo() {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, reset, control } = useForm<TodoForm>({
        defaultValues: {
            title: "",
            description: "",
            is_completed: false,
        },
    });

    // 로그인된 사용자 정보 가져오기
    const { id: userId, email } = useUserStore();
    const { mutate: createTodo } = useApiForCreateTodo();

    const onSubmit = (data: TodoForm) => {
        if (!userId) {
            toast.error("로그인된 사용자 정보가 필요합니다.");
            return;
        }

        // API 요청을 위한 데이터를 구성하고 요청 실행
        createTodo(
            {
                title: data.title,
                description: data.description,
                is_completed: data.is_completed,
                userId: userId, // 현재 로그인된 사용자의 ID
            },
            {
                onSuccess: () => {
                    toast.success("할 일이 추가되었습니다.");
                    setOpen(false);
                    reset(); // 폼 초기화
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>할 일 추가</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>새 할 일 추가</DialogTitle>

                {/* 로그인된 사용자 정보 표시 */}
                {/* <div className="mb-4 text-sm text-gray-700">
                    <p><strong>사용자 이메일:</strong> {email}</p>
                    <p><strong>사용자 ID:</strong> {userId}</p>
                </div> */}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                제목
                            </label>
                            <Input
                                id="title"
                                {...register("title", { required: "제목을 입력해주세요." })}
                                placeholder="할 일 제목"
                                className="mt-1 block w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                설명
                            </label>
                            <textarea
                                id="description"
                                {...register("description")}
                                placeholder="할 일 설명"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex items-center">
                            <Controller
                                name="is_completed"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="is_completed"
                                        checked={field.value}
                                        onCheckedChange={(checked) => field.onChange(checked)}
                                    />
                                )}
                            />
                            <label htmlFor="is_completed" className="ml-2 text-sm font-medium text-gray-700">
                                완료 여부
                            </label>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button type="submit">저장</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
