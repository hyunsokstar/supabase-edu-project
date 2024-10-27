"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

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

    const onSubmit = (data: TodoForm) => {
        console.log("입력 내용:", data); // 입력한 내용 로그 확인
        toast.success("할 일이 추가되었습니다.");
        setOpen(false);
        reset(); // 폼 초기화
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>할 일 추가</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>새 할 일 추가</DialogTitle>
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
