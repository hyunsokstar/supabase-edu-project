// src/app/todo-management/todo-dashboard/all-tasks/LoadingSkeletonForTodoList.tsx

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeletonForTodoList = () => {
    return (
        <div className="container mx-auto p-4 animate-pulse">
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
};

export default LoadingSkeletonForTodoList;
