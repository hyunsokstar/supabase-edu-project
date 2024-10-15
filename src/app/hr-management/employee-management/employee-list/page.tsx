// C:\new-dankkumi\edu-project\src\components\EmployListPage.tsx
'use client';

import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react'; // 수정 및 삭제 아이콘
import DialogButtonForUpdateUserInfoForUserId from '@/components/Button/DialogButtonForUpdateUserInfoForUserId';
import DialogButtonForDeleteUserInfoForUserId from '@/components/Button/DialogButtonForDeleteUserInfoForUserId';
import { useSupabaseForGetAllUserList } from '@/hooks/useSupabaseForGetAllUserList'; // React Query 훅 사용

const EmployListPage: React.FC = () => {
    const { data: employees, isLoading, error } = useSupabaseForGetAllUserList(); // React Query에서 받아오는 데이터, 로딩, 에러 상태
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">직원 리스트</h1>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">이메일</th>
                        <th className="border p-2 text-left">유저 이미지</th>
                        <th className="border p-2 text-left">전화번호</th>
                        <th className="border p-2 text-left">GitHub URL</th>
                        <th className="border p-2 text-left">오늘 완료한 작업 수</th>
                        <th className="border p-2 text-left">현재 작업</th>
                        <th className="border p-2 text-center">수정</th>
                        <th className="border p-2 text-center">삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {employees && employees.length > 0 ? (
                        employees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-50">
                                <td className="border p-2">{employee.email}</td>
                                <td className="border p-2">
                                    {/* <img
                                        src={employee.user_image}
                                        alt="User Image"
                                        className="w-16 h-16 object-cover rounded-full"
                                    /> */}
                                    {employee.user_image ?
                                        <img src={employee.user_image} alt="User Image" className="w-16 h-16 object-cover rounded-full" /> : "이미지 없음"
                                    }
                                </td>
                                <td className="border p-2">{employee.phone_number}</td>
                                <td className="border p-2">
                                    <a href={employee.github_url} target="_blank" rel="noopener noreferrer">
                                        {employee.github_url}
                                    </a>
                                </td>
                                <td className="border p-2 text-center">{employee.today_completed_tasks_count}</td>
                                <td className="border p-2">{employee.current_task}</td>
                                <td className="border p-2 text-center">
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => setSelectedUser(employee)}
                                    >
                                        <Edit className="w-5 h-5 inline" />
                                    </button>
                                </td>
                                <td className="border p-2 text-center">
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => setUserToDelete(employee)}
                                    >
                                        <Trash2 className="w-5 h-5 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="border p-2 text-center">
                                데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 수정 버튼을 클릭하면 다이얼로그가 열림 */}
            {selectedUser && (
                <DialogButtonForUpdateUserInfoForUserId
                    userId={selectedUser.id}
                    initialEmail={selectedUser.email}
                    initialPhoneNumber={selectedUser.phone_number}
                    initialGithubUrl={selectedUser.github_url}
                    initialUserImage={selectedUser.user_image}
                    initialTodayCompletedTasksCount={selectedUser.today_completed_tasks_count}
                    initialCurrentTask={selectedUser.current_task}
                    onClose={() => setSelectedUser(null)}
                />
            )}

            {/* 삭제 버튼을 클릭하면 다이얼로그가 열림 */}
            {userToDelete && (
                <DialogButtonForDeleteUserInfoForUserId
                    userId={userToDelete.id}
                    userEmail={userToDelete.email}
                    onClose={() => setUserToDelete(null)}
                />
            )}
        </div>
    );
};

export default EmployListPage;
