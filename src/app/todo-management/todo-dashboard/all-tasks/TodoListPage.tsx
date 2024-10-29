// src/app/todo-management/todo-dashboard/all-tasks/TodoListPage.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import DialogButtonForCreateTodo from '@/components/Button/DialogButtonForCreateTodo';
import { Skeleton } from '@/components/ui/skeleton';
import useApiForGetTodoList from '@/hooks/useApiForTodoList';
import { format } from 'date-fns';

const TodoListPage = () => {
    const { data: todoList, isLoading, error } = useApiForGetTodoList();

    const handleDeleteTodo = async (todoId: number) => {
        // 삭제 로직
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
                                {["First Menu", "Second Menu", "Status", "Status Changed At", "User", "Actions"].map(
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
                                    <td className="p-3"><Skeleton className="h-4 w-full rounded-md" /></td>
                                    <td className="p-3"><Skeleton className="h-4 w-full rounded-md" /></td>
                                    <td className="p-3"><Skeleton className="h-4 w-full rounded-md" /></td>
                                    <td className="p-3"><Skeleton className="h-4 w-full rounded-md" /></td>
                                    <td className="p-3">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <Skeleton className="h-4 mt-2 w-24 rounded-md" />
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
                                <th className="p-3 text-left w-[150px]">First Menu</th>
                                <th className="p-3 text-left w-[150px]">Second Menu</th>
                                <th className="p-3 text-left w-[100px]">Status</th>
                                <th className="p-3 text-left w-[150px]">Status Changed At</th>
                                <th className="p-3 text-left w-[200px]">User</th>
                                <th className="p-3 text-center w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todoList.map((todo) => (
                                <tr key={todo.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-3">{todo.first_menu || 'N/A'}</td>
                                    <td className="p-3">{todo.second_menu || 'N/A'}</td>
                                    <td className="p-3">{todo.status || 'Unknown'}</td>
                                    <td className="p-3">{format(new Date(todo.status_changed_at), 'yyyy-MM-dd')}</td>
                                    <td className="p-3 flex items-center space-x-3">
                                        <img
                                            src={todo.users.profile.user_image || 'https://via.placeholder.com/40'}
                                            alt="User Avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>
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
