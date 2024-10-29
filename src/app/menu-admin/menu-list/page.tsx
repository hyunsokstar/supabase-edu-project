"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Eye } from "lucide-react";
import useApiForGetMenuStructureList from '@/hooks/useApiForGetMenuStructureList';
import useApiForMultiCreateTodo from '@/hooks/useApiForMultiCreateTodo';
import { IMenuStructure } from '@/type/typeForMenuStructure';
import { format } from 'date-fns';
import { flattenMenuStructure } from '@/lib/flattenMenu';

const MenuListPage = () => {
    const [selectedMenu, setSelectedMenu] = useState<IMenuStructure | null>(null);
    const { data: menuData, isLoading, error } = useApiForGetMenuStructureList();
    const [textareaContent, setTextareaContent] = useState(""); // 배열을 위한 Textarea 상태
    const [jsonError, setJsonError] = useState<string | null>(null); // 배열 오류 상태
    const { mutate: createTodos } = useApiForMultiCreateTodo();

    const handleRowClick = (menu: IMenuStructure) => {
        setSelectedMenu(menu);
        setTextareaContent(
            typeof menu.menu_structure === "string"
                ? menu.menu_structure
                : JSON.stringify(menu.menu_structure, null, 2)
        );
        setJsonError(null); // 메뉴 클릭 시 오류 초기화
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setTextareaContent(value);

        try {
            // 배열 또는 객체 파싱 시도
            let updatedStructure;

            // 사용자가 배열이나 객체 형식으로 입력했는지 검사
            if (value.trim().startsWith("[") || value.trim().startsWith("{")) {
                updatedStructure = JSON.parse(value); // 배열 또는 객체 파싱
            } else {
                throw new Error("유효한 배열이나 객체 형식이 아닙니다.");
            }

            if (!Array.isArray(updatedStructure) && typeof updatedStructure !== 'object') {
                throw new Error("입력된 데이터가 배열 또는 객체 형식이 아닙니다.");
            }

            setJsonError(null); // 유효한 배열이나 객체면 오류 메시지 초기화
            setSelectedMenu({ ...selectedMenu, menu_structure: updatedStructure });
        } catch (error) {
            setJsonError("유효한 배열 또는 객체 형식이 아닙니다. 형식을 확인해 주세요.");
        }
    };

    const handleUpdateClick = () => {
        if (!selectedMenu) return;

        try {
            const menuStructure = typeof selectedMenu.menu_structure === 'string'
                ? JSON.parse(selectedMenu.menu_structure)
                : selectedMenu.menu_structure;

            const flattenedMenus = flattenMenuStructure(menuStructure);
            console.log('변환된 메뉴 구조:', JSON.stringify(flattenedMenus, null, 2));

            // Supabase에 변환된 메뉴 구조로 할 일들 추가
            createTodos(flattenedMenus);
        } catch (error) {
            console.error("메뉴 구조 처리 중 오류 발생:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">메뉴 구조 관리</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        전체 메뉴 구조를 관리하고 상태를 확인합니다
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    메뉴 추가
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <input type="checkbox" aria-label="Select all" />
                                    </TableHead>
                                    <TableHead className="w-[300px]">설명</TableHead>
                                    <TableHead className="w-[150px]">분류</TableHead>
                                    <TableHead>생성 날짜</TableHead>
                                    <TableHead>생성자</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-32 text-gray-500">
                                            로딩 중...
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-32 text-red-500">
                                            데이터를 불러오는 중 오류가 발생했습니다.
                                        </TableCell>
                                    </TableRow>
                                ) : menuData && menuData.length > 0 ? (
                                    menuData.map((menu: IMenuStructure) => (
                                        <TableRow
                                            key={menu.id}
                                            className="cursor-pointer hover:bg-gray-50"
                                        >
                                            <TableCell>
                                                <input type="checkbox" />
                                            </TableCell>
                                            <TableCell
                                                onClick={() => handleRowClick(menu)}
                                                className="cursor-pointer flex items-center text-blue-600 hover:underline"
                                            >
                                                <span className="line-clamp-2">{menu.description}</span>
                                                <Eye className="w-4 h-4 ml-2" aria-hidden="true" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {menu.classification}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs text-gray-500">
                                                    {format(new Date(menu.created_at), 'yyyy-MM-dd')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <img
                                                        src={menu.users?.profile?.user_image || "/default-avatar.png"}
                                                        alt="user avatar"
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-32 text-gray-500">
                                            등록된 메뉴 구조가 없습니다
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                <Card className="p-4">
                    {selectedMenu ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        최종 수정: {format(new Date(selectedMenu.updated_at), 'yyyy-MM-dd')}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleUpdateClick}
                                    disabled={!!jsonError} // 배열 오류가 있을 때 버튼 비활성화
                                >
                                    반영
                                </Button>
                            </div>
                            <Textarea
                                className="min-h-[600px] font-mono text-sm"
                                value={textareaContent}
                                onChange={handleTextareaChange}
                                placeholder="메뉴 구조 배열을 입력하세요..."
                            />
                            {jsonError && (
                                <p className="text-red-500 text-sm mt-2">{jsonError}</p>
                            )}
                        </div>
                    ) : (
                        <div className="h-[600px] flex items-center justify-center text-gray-500">
                            메뉴를 선택하면 구조가 표시됩니다
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MenuListPage;