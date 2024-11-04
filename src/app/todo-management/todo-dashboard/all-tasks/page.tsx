// src/app/todo-management/todo-dashboard/all-tasks/TodoListPage.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import DialogButtonForCreateTodo from '@/components/Button/DialogButtonForCreateTodo';
import { Skeleton } from '@/components/ui/skeleton';
import useApiForGetTodoList from '@/hooks/useApiForTodoList';
import useApiForDeleteTodo from '@/hooks/useApiForDeleteTodo';
import DialogButtonForMenuStructureListForSelect from '@/app/DialogButtonForMenuStructureListForSelect';
import useApiForUpdateTodoCompletion from '@/hooks/useApiForUpdateTodoCompletionStatus';

interface GroupedTodo {
    firstMenu: string;
    rowspan: number;
    todos: any[];
}

const TodoListPage = () => {
    const { data: todoList, isLoading, error } = useApiForGetTodoList();
    const deleteTodoMutation = useApiForDeleteTodo();
    const updateTodoCompletionMutation = useApiForUpdateTodoCompletion();
    const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
    const [completedTodos, setCompletedTodos] = useState<{ [key: number]: boolean }>({});

    // first_menu 기준으로 그룹화된 데이터 생성 (정렬 제거)
    const groupedTodos = useMemo(() => {
        if (!todoList) return [];

        const grouped: GroupedTodo[] = [];
        let currentGroup: GroupedTodo | null = null;

        // 정렬 없이 원래 순서대로 그룹화
        todoList.forEach((todo) => {
            if (!currentGroup || currentGroup.firstMenu !== todo.first_menu) {
                if (currentGroup) {
                    grouped.push(currentGroup);
                }
                currentGroup = {
                    firstMenu: todo.first_menu,
                    rowspan: 1,
                    todos: [todo]
                };
            } else {
                currentGroup.rowspan++;
                currentGroup.todos.push(todo);
            }
        });

        if (currentGroup) {
            grouped.push(currentGroup);
        }

        return grouped;
    }, [todoList]);

    const handleDeleteTodo = (todoId: number) => {
        deleteTodoMutation.mutate(todoId);
    };

    const handleCheckboxChange = (todoId: number) => {
        setSelectedTodos((prevSelected) =>
            prevSelected.includes(todoId)
                ? prevSelected.filter((id) => id !== todoId)
                : [...prevSelected, todoId]
        );
    };

    const handleCompletedChange = (todoId: number, isCompleted: boolean) => {
        setCompletedTodos((prevCompleted) => ({
            ...prevCompleted,
            [todoId]: isCompleted
        }));
        updateTodoCompletionMutation.mutate({ todoId, isCompleted });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <Skeleton />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">Failed to load todos.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-center">Todo List</h1>
                <div className="flex items-center space-x-4">
                    <DialogButtonForCreateTodo />
                    <DialogButtonForMenuStructureListForSelect />
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">총 {todoList?.length || 0}개의 할 일이 있습니다.</p>
                {selectedTodos.length > 0 && (
                    <Button
                        onClick={() => console.log('Deleting selected todos:', selectedTodos)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        선택한 항목 삭제
                    </Button>
                )}
            </div>

            <div className="overflow-x-auto">
                {groupedTodos.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="p-3 text-center w-[50px] border-r border-gray-300">Select</th>
                                <th className="p-3 text-center w-[150px] border-r border-gray-300">First Menu</th>
                                <th className="p-3 text-center w-[150px] border-r border-gray-300">Second Menu</th>
                                <th className="p-3 text-center w-[100px] border-r border-gray-300">Completed</th>
                                <th className="p-3 text-center w-[200px] border-r border-gray-300">User</th>
                                <th className="p-3 text-center w-[100px] border-r border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedTodos.map((group, groupIndex) => (
                                group.todos.map((todo, todoIndex) => (
                                    <tr key={todo.id} className="border-b last:border-0">
                                        <td className="p-3 text-center border-r border-gray-300 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={selectedTodos.includes(todo.id)}
                                                onChange={() => handleCheckboxChange(todo.id)}
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                            />
                                        </td>
                                        {todoIndex === 0 && (
                                            <td className="p-3 text-center border-r border-gray-300 hover:bg-gray-50" rowSpan={group.rowspan}>
                                                {group.firstMenu || 'N/A'}
                                            </td>
                                        )}
                                        <td className="p-3 text-center border-r border-gray-300 hover:bg-gray-50">{todo.second_menu || 'N/A'}</td>
                                        <td className="p-3 text-center border-r border-gray-300 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={completedTodos[todo.id] ?? todo.is_completed}
                                                onChange={() => handleCompletedChange(todo.id, !completedTodos[todo.id])}
                                                className="form-checkbox h-5 w-5 text-green-600"
                                            />
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-3">
                                            <img
                                                src={todo.users.profile.user_image || 'https://via.placeholder.com/40'}
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-300 hover:bg-gray-50">
                                            <div className="flex items-center justify-center space-x-2">
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
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
