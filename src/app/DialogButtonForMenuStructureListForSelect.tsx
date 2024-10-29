"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import useApiForGetMenuStructureList from "@/hooks/useApiForGetMenuStructureList";
import useApiForCreateMultiTodosWithMenuArray from "@/hooks/useApiForCreateMultiTodosWithMenuArray";
import { IMenuStructure } from "@/type/typeForMenuStructure";
import { IRequestTypeForApiForCreateMultiTodosWithMenuArray } from "@/type/typeForTodos";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import useUserStore from "@/store/userStore";

const DialogButtonForMenuStructureListForSelect = () => {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<IMenuStructure | null>(null);
  const [editableJson, setEditableJson] = useState<string | null>(null);
  const { data: menuData, isLoading, error } = useApiForGetMenuStructureList();
  
  const createMultiTodosMutation = useApiForCreateMultiTodosWithMenuArray();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableJson(event.target.value);
  };

  const handleMenuSelect = (menu: IMenuStructure) => {
    setSelectedMenu(menu);
    setEditableJson(JSON.stringify(menu.menu_structure, null, 2)); // JSON 보기 좋게 변환하여 상태에 저장
  };

  const handleSaveChanges = () => {
    if (selectedMenu && editableJson) {
      try {
        const updatedStructure = JSON.parse(editableJson);
        setSelectedMenu({
          ...selectedMenu,
          menu_structure: updatedStructure,
        });
        alert("Changes saved successfully!");
      } catch (error) {
        alert("Invalid JSON format. Please correct and try again.");
      }
    }
  };

  const handleAllChange = () => {
    if (editableJson) {
      try {
        const menuStructure = JSON.parse(editableJson);
        // JSON 파싱 결과가 배열인지 확인
        if (!Array.isArray(menuStructure)) {
          throw new Error("Parsed JSON is not an array. Please ensure the JSON is in array format.");
        }

        // 메뉴 구조에서 최상위와 하위 메뉴 쌍을 추출
        const menuPairs: IRequestTypeForApiForCreateMultiTodosWithMenuArray[] = [];
        menuStructure.forEach((menu) => {
          const pairs = extractMenuPairs([menu]);
          menuPairs.push(...pairs);
        });

        // user ID 추가 및 API 호출
        const userStore = useUserStore.getState();
        if (!userStore.id) {
          throw new Error('로그인된 사용자를 찾을 수 없습니다.');
        }

        const requestWithUserId = menuPairs.map((pair) => ({
          ...pair,
          user_id: userStore.id,
        }));

        createMultiTodosMutation.mutate(requestWithUserId);
      } catch (error) {
        alert(`Invalid JSON format or error occurred: ${error.message}`);
      }
    }
  };

  // 트리 구조에서 최상위 메뉴와 최하위 메뉴 쌍을 추출하는 함수
  const extractMenuPairs = (menuItems: IMenuStructure[], firstMenu: string = ""): IRequestTypeForApiForCreateMultiTodosWithMenuArray[] => {
    let menuPairs: IRequestTypeForApiForCreateMultiTodosWithMenuArray[] = [];

    menuItems.forEach((item) => {
      const currentFirstMenu = firstMenu || item.name;

      if (item.items && item.items.length > 0) {
        menuPairs = menuPairs.concat(extractMenuPairs(item.items, currentFirstMenu));
      } else {
        menuPairs.push({
          first_menu: currentFirstMenu,
          second_menu: item.name,
        });
      }
    });

    return menuPairs;
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        메뉴 선택
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full">
          <DialogHeader>
            <DialogTitle>메뉴 구조 선택</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽: 메뉴 정보 테이블 */}
            <div className="overflow-x-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>설명</TableHead>
                    <TableHead>분류</TableHead>
                    <TableHead>생성 날짜</TableHead>
                    <TableHead>생성자</TableHead>
                    <TableHead>전체 update</TableHead>
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
                        className="hover:bg-gray-50"
                        onClick={() => handleMenuSelect(menu)}
                      >
                        <TableCell className="flex items-center space-x-2">
                          <span className="text-blue-600 hover:underline cursor-pointer">
                            {menu.description}
                          </span>
                          <Eye className="w-4 h-4 ml-2" aria-hidden="true" />
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {menu.classification || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>{format(new Date(menu.created_at), "yyyy-MM-dd")}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <img
                              src={menu.users?.profile?.user_image || "/default-avatar.png"}
                              alt="user avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-blue-600" onClick={handleAllChange}>
                              All Change
                            </Button>
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

            {/* 오른쪽: 메뉴 구조 상세 */}
            <div className="p-4 border-l border-gray-300">
              {selectedMenu ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        최종 수정: {format(new Date(selectedMenu.updated_at), "yyyy-MM-dd")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSaveChanges}>
                      저장
                    </Button>
                  </div>
                  <Textarea
                    className="min-h-[600px] font-mono w-full"
                    value={editableJson || ""}
                    onChange={handleTextChange}
                  />
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-md">
                  메뉴를 선택하면 구조가 표시됩니다
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogButtonForMenuStructureListForSelect;
