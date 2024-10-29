// src/app/menu-admin/menu-list/page.tsx

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
import { IMenuStructure } from '@/type/typeForMenuStructure';
import { format } from 'date-fns';

const MenuListPage = () => {
    const [selectedMenu, setSelectedMenu] = useState<IMenuStructure | null>(null);
    const { data: menuData, isLoading, error } = useApiForGetMenuStructureList();

    console.log("menuData : ", menuData);  // 데이터 구조 확인용 로그

    const handleRowClick = (menu: IMenuStructure) => {
        setSelectedMenu(menu);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* 헤더 섹션 */}
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

            {/* 분할된 메인 컨텐츠 */}
            <div className="grid grid-cols-2 gap-6">
                {/* 왼쪽: 메뉴 정보 테이블 */}
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

                {/* 오른쪽: 메뉴 구조 상세 */}
                <Card className="p-4">
                    {selectedMenu ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        최종 수정: {format(new Date(selectedMenu.updated_at), 'yyyy-MM-dd')}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">수정</Button>
                            </div>
                            <Textarea
                                className="min-h-[600px] font-mono"
                                value={JSON.stringify(selectedMenu.menu_structure, null, 2)}
                                readOnly
                            />
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
