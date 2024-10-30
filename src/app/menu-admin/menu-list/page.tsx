"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import Editor from "@monaco-editor/react";

const MenuListPage = () => {
    const [selectedMenu, setSelectedMenu] = useState<IMenuStructure | null>(null);
    const { data: menuData, isLoading, error } = useApiForGetMenuStructureList();
    const [editorContent, setEditorContent] = useState<string>('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const { mutate: createTodos } = useApiForMultiCreateTodo();

    const handleRowClick = (menu: IMenuStructure) => {
        setSelectedMenu(menu);
        setJsonError(null);

        let contentToSet = '';
        try {
            const menuStructure = typeof menu.menu_structure === 'string'
                ? JSON.parse(menu.menu_structure)
                : menu.menu_structure;
            contentToSet = JSON.stringify(menuStructure, null, 2);
            setEditorContent(contentToSet);
        } catch (error) {
            console.error('메뉴 구조 파싱 에러:', error);
            setEditorContent('[]');
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        if (!value) return;

        try {
            JSON.parse(value); // 유효성 검사
            setJsonError(null);
            setEditorContent(value);
        } catch (error) {
            setJsonError("유효한 JSON 형식이 아닙니다.");
        }
    };

    const handleUpdateClick = () => {
        if (!selectedMenu || !editorContent) return;

        try {
            const parsedContent = JSON.parse(editorContent);
            const flattenedMenus = flattenMenuStructure(parsedContent);
            console.log('변환된 메뉴 구조:', flattenedMenus);
            createTodos(flattenedMenus);
        } catch (error) {
            console.error("메뉴 구조 처리 중 오류 발생:", error);
            setJsonError("메뉴 구조 처리 중 오류가 발생했습니다.");
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
                                                <input type="checkbox" aria-label={`Select menu ${menu.id}`} />
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
                                    disabled={!!jsonError}
                                >
                                    반영
                                </Button>
                            </div>
                            <Editor
                                height="600px"
                                defaultLanguage="json"
                                value={editorContent}
                                onChange={handleEditorChange}
                                options={{
                                    minimap: { enabled: false },
                                    wordWrap: "on",
                                    formatOnType: true,
                                    tabSize: 2,
                                    insertSpaces: true,
                                    autoIndent: "advanced",
                                    detectIndentation: false,
                                }}
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