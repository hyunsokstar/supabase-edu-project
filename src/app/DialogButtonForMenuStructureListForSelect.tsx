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
import useApiForMultiCreateTodo from "@/hooks/useApiForMultiCreateTodo";
import { IMenuStructure } from "@/type/typeForMenuStructure";
import { format } from "date-fns";
import Editor from "@monaco-editor/react"; // Monaco Editor 사용

const DialogButtonForMenuStructureListForSelect = () => {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<IMenuStructure | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const { data: menuData, isLoading, error } = useApiForGetMenuStructureList();
  const { mutate: createTodos } = useApiForMultiCreateTodo();

  const handleMenuSelect = (menu: IMenuStructure) => {
    setSelectedMenu(menu);
    setEditorContent(
      typeof menu.menu_structure === "string"
        ? JSON.stringify(JSON.parse(menu.menu_structure), null, 2) // JSON 포맷 적용
        : JSON.stringify(menu.menu_structure, null, 2) // JSON 포맷 적용
    );
    setJsonError(null);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
    }
  };

  // handleUpdateClick 함수만 수정
  const handleUpdateClick = () => {
    if (!selectedMenu) return;

    try {
      // 입력된 JSON 데이터를 객체로 파싱
      const updatedStructure = JSON.parse(editorContent);

      // selectedMenu의 메뉴 구조 업데이트
      setSelectedMenu({ ...selectedMenu, menu_structure: updatedStructure });

      // 전체 메뉴 구조를 직접 전달
      createTodos(updatedStructure);

      console.log('메뉴 구조 전달:', JSON.stringify(updatedStructure, null, 2));

    } catch (error) {
      setJsonError("유효한 객체 형식이 아닙니다. 형식을 확인해 주세요.");
    }
  };

  // 메뉴 구조를 평탄화하여 first_menu와 second_menu 배열로 변환하는 함수
  const flattenMenuStructure = (menu, parentMenu = null) => {
    let result = [];

    // 첫 번째 레벨 메뉴 설정
    const currentFirstMenu = parentMenu || menu.name;

    if (menu.items && Array.isArray(menu.items)) {
      menu.items.forEach((item) => {
        if (item.items && Array.isArray(item.items)) {
          // item에 하위 메뉴가 있을 경우 재귀적으로 탐색
          result.push(...flattenMenuStructure(item, currentFirstMenu));
        } else {
          // 하위 메뉴가 없는 경우, first_menu와 second_menu로 저장
          result.push({
            first_menu: currentFirstMenu,
            second_menu: item.name,
          });
        }
      });
    } else {
      // items가 없는 경우 단일 메뉴로 추가
      result.push({
        first_menu: currentFirstMenu,
        second_menu: menu.name,
      });
    }

    return result;
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
                    <TableHead>반영</TableHead>
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
                            <Button variant="outline" size="sm" className="text-blue-600" onClick={handleUpdateClick}>
                              반영
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600"
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
                      autoIndent: "full",
                    }}
                  />
                  {jsonError && (
                    <p className="text-red-500 text-sm mt-2">{jsonError}</p>
                  )}
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
