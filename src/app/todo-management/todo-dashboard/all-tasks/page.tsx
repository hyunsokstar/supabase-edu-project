// src/pages/TodoListPage.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import useApiForGetTodoList from '@/hooks/useApiForTodoList';

const TodoListPage = () => {
    const { data: todoList, isLoading, error } = useApiForGetTodoList();

    if (isLoading) {
        return <Loader className="h-8 w-8 mx-auto my-4" />;
    }

    if (error) {
        return <div className="text-red-500 text-center">Failed to load todos.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>
            <div className="overflow-x-auto">
                {todoList && todoList.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left text-gray-600 font-semibold">Title</th>
                                <th className="p-3 text-left text-gray-600 font-semibold">Description</th>
                                <th className="p-3 text-left text-gray-600 font-semibold">Completed</th>
                                <th className="p-3 text-center text-gray-600 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todoList.map((todo) => (
                                <tr key={todo.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-3">{todo.title}</td>
                                    <td className="p-3">{todo.description || 'No description'}</td>
                                    <td className="p-3">{todo.is_completed ? 'Yes' : 'No'}</td>
                                    <td className="p-3 text-center">
                                        <Button variant="outline" size="sm" className="mr-2">
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                            Delete
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
