"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import DialogButtonForCreateTodo from '@/components/Button/DialogButtonForCreateTodo';
import { Skeleton } from '@/components/ui/skeleton';
import useApiForDeleteTodo from '@/hooks/useApiForDeleteTodo';
import DialogButtonForMenuStructureListForSelect from '@/app/DialogButtonForMenuStructureListForSelect';
import useApiForUpdateTodoCompletionStatus from '@/hooks/useApiForUpdateTodoCompletionStatus';
import useApiForGetTodoList from '@/hooks/useApiForTodoList';
import { useQueryClient } from '@tanstack/react-query';

interface GroupedTodo {
    firstMenu: string;
    rowspan: number;
    todos: any[];
}

const TodoListPage = () => {
    const queryClient = useQueryClient();
    const { data: todoList, isLoading, error } = useApiForGetTodoList();
    const deleteTodoMutation = useApiForDeleteTodo();
    const updateTodoCompletionMutation = useApiForUpdateTodoCompletionStatus();
    const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
    const [groupedTodos, setGroupedTodos] = useState<GroupedTodo[]>([]);

    useEffect(() => {
        if (!todoList) {
            setGroupedTodos([]);
            return;
        }

        // 그룹핑 로직: todoList 변경 시마다 업데이트되도록 설정
        const grouped: GroupedTodo[] = [];
        let currentGroup: GroupedTodo | null = null;

        todoList.forEach((todo) => {
            if (!currentGroup || currentGroup.firstMenu !== todo.first_menu) {
                if (currentGroup) {
                    grouped.push(currentGroup);
                }
                currentGroup = {
                    firstMenu: todo.first_menu,
                    rowspan: 1,
                    todos: [todo],
                };
            } else {
                currentGroup.rowspan++;
                currentGroup.todos.push(todo);
            }
        });

        if (currentGroup) {
            grouped.push(currentGroup);
        }

        setGroupedTodos(grouped);
    }, [todoList]);

    const handleDeleteTodo = (todoId: number) => {
        deleteTodoMutation.mutate(todoId, {
            onSuccess: () => {
                // 할 일 삭제 후 데이터 쿼리 무효화하여 최신 상태 반영
                setSelectedTodos((prevSelected) =>
                    prevSelected.filter((id) => id !== todoId)
                );
            },
        });
    };

    const handleCheckboxChange = (todoId: number) => {
        setSelectedTodos((prevSelected) =>
            prevSelected.includes(todoId)
                ? prevSelected.filter((id) => id !== todoId)
                : [...prevSelected, todoId]
        );
    };

    const handleCompletedChange = (todoId: number, isCompleted: boolean) => {
        updateTodoCompletionMutation.mutate(
            { todoId, isCompleted },
            {
                onSuccess: () => {
                    // 완료 상태 업데이트 후 데이터 쿼리 무효화하여 최신 상태 반영
                    queryClient.invalidateQueries(['todoList']);
                },
            }
        );
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
                    <div
                        onClick={() => console.log('Deleting selected todos:', selectedTodos)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded cursor-pointer"
                    >
                        선택한 항목 삭제
                    </div>
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
                            {groupedTodos.map((group) =>
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
                                            <td
                                                className="p-3 text-center border-r border-gray-300 hover:bg-gray-50"
                                                rowSpan={group.rowspan}
                                            >
                                                {group.firstMenu || 'N/A'}
                                            </td>
                                        )}
                                        <td className="p-3 text-center border-r border-gray-300 hover:bg-gray-50">
                                            {todo.second_menu || 'N/A'}
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-300 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={todo.is_completed}
                                                onChange={() => handleCompletedChange(todo.id, !todo.is_completed)}
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
                                                <div className="text-blue-500 hover:text-blue-700">
                                                    <Button variant="ghost" size="icon">
                                                        <Edit size={20} />
                                                    </Button>
                                                </div>
                                                <div className="text-red-500 hover:text-red-700">
                                                    <div onClick={() => handleDeleteTodo(todo.id)}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Trash size={20} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
