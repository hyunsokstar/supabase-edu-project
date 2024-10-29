// src/app/todo-management/todo-dashboard/all-tasks/TodoListPage.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import DialogButtonForCreateTodo from '@/components/Button/DialogButtonForCreateTodo';
import { Skeleton } from '@/components/ui/skeleton';
import useApiForGetTodoList from '@/hooks/useApiForTodoList';

const TodoListPage = () => {
    const { data: todoList, isLoading, error } = useApiForGetTodoList();

    const handleDeleteTodo = async (todoId: number) => {
        // 삭제 로직
    };

    const getDayOfWeekName = (day: number): string => {
        const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        return days[day] || "알 수 없음";
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-1/3 rounded-md" />
                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                {["User", "Title", "Description", "Completed", "Day of Week", "Order", "Actions"].map(
                                    (header, index) => (
                                        <th key={index} className="p-3 text-left">
                                            <Skeleton className="h-4 w-full rounded-md" />
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <tr key={rowIndex} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-3">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <Skeleton className="h-4 mt-2 w-24 rounded-md" />
                                    </td>
                                    <td className="p-3">
                                        <Skeleton className="h-4 w-full rounded-md" />
                                    </td>
                                    <td className="p-3">
                                        <Skeleton className="h-4 w-full rounded-md" />
                                    </td>
                                    <td className="p-3">
                                        <Skeleton className="h-4 w-8 rounded-md" />
                                    </td>
                                    <td className="p-3">
                                        <Skeleton className="h-4 w-16 rounded-md" />
                                    </td>
                                    <td className="p-3">
                                        <Skeleton className="h-4 w-12 rounded-md" />
                                    </td>
                                    <td className="p-3 text-center flex justify-center space-x-2">
                                        <Skeleton className="w-5 h-5 rounded-md" />
                                        <Skeleton className="w-5 h-5 rounded-md" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">Failed to load todos.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Todo List</h1>
                <DialogButtonForCreateTodo />
            </div>

            <div className="overflow-x-auto">
                {todoList && todoList.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">User</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-left">Completed</th>
                                <th className="p-3 text-left">Day of Week</th>
                                <th className="p-3 text-left">Order</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todoList.map((todo) => (
                                <tr key={todo.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-3 flex items-center">
                                        <img
                                            src={todo.users.profile.user_image || 'https://via.placeholder.com/40'}
                                            alt="User Avatar"
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <span>{todo.users.email || 'Unknown User'}</span>
                                    </td>
                                    <td className="p-3">{todo.title}</td>
                                    <td className="p-3">{todo.description || 'No description'}</td>
                                    <td className="p-3">{todo.is_completed ? 'Yes' : 'No'}</td>
                                    <td className="p-3">{getDayOfWeekName(todo.day_of_week)}</td>
                                    <td className="p-3">{todo.order}</td>
                                    <td className="p-3 text-center flex justify-center space-x-2">
                                        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                                            <Edit className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteTodo(todo.id)}
                                        >
                                            <Trash className="w-5 h-5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-500 py-8">No todos available</div>
                )}
            </div>
        </div>
    );
};

export default TodoListPage;
