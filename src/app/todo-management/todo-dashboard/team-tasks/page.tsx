import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

interface MenuItemType {
  key: string;
  name: string;
  items?: MenuItemType[];
}

interface GroupedMenuItem {
  topLevel: {
    name: string;
    key: string;
    rowspan: number;
    isFirst: boolean;
  };
  secondLevel: {
    name: string;
    key: string;
    rowspan: number;
    isFirst: boolean;
  };
  leaf: {
    name: string;
    completed: boolean;
  };
}

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TaskAdminPageForMenuStructure = () => {
  // 샘플 데이터
  const sampleData: GroupedMenuItem[] = [
    {
      topLevel: {
        name: "Todo 관리",
        key: "todo-management",
        rowspan: 3,
        isFirst: true
      },
      secondLevel: {
        name: "대시보드",
        key: "todo-dashboard",
        rowspan: 2,
        isFirst: true
      },
      leaf: {
        name: "모든 작업 보기",
        completed: true
      }
    },
    {
      topLevel: {
        name: "Todo 관리",
        key: "todo-management",
        rowspan: 3,
        isFirst: false
      },
      secondLevel: {
        name: "대시보드",
        key: "todo-dashboard",
        rowspan: 2,
        isFirst: false
      },
      leaf: {
        name: "내 작업",
        completed: false
      }
    },
    {
      topLevel: {
        name: "Todo 관리",
        key: "todo-management",
        rowspan: 3,
        isFirst: false
      },
      secondLevel: {
        name: "작업 생성",
        key: "task-creation",
        rowspan: 1,
        isFirst: true
      },
      leaf: {
        name: "새 작업 추가",
        completed: false
      }
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">메뉴 구조 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            전체 메뉴 구조를 관리하고 진행 상황을 확인합니다
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="w-4 h-4 mr-2" />
              메뉴 생성
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 메뉴 생성</DialogTitle>
              <DialogDescription>
                새로운 메뉴를 생성하려면 아래 정보를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500">메뉴 생성 폼은 요구사항에 맞게 구현 필요</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <div className="p-4 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder="메뉴 검색..."
              className="pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              전체
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                30
              </span>
            </Button>
            <Button variant="outline">
              완료
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
                12
              </span>
            </Button>
            <Button variant="outline">
              진행중
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                18
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 테이블 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y">
                <th className="py-3 px-4 text-left font-semibold">1차 메뉴</th>
                <th className="py-3 px-4 text-left font-semibold">2차 메뉴</th>
                <th className="py-3 px-4 text-left font-semibold">3차 메뉴</th>
                <th className="py-3 px-4 text-left font-semibold w-32">완료 여부</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {item.topLevel.isFirst && (
                    <td className="py-3 px-4 border-r" rowSpan={item.topLevel.rowspan}>
                      <div className="font-medium">{item.topLevel.name}</div>
                    </td>
                  )}
                  {item.secondLevel.isFirst && (
                    <td className="py-3 px-4 border-r" rowSpan={item.secondLevel.rowspan}>
                      <div>{item.secondLevel.name}</div>
                    </td>
                  )}
                  <td className="py-3 px-4 border-r">
                    <div>{item.leaf.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-sm font-semibold
                      ${item.leaf.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.leaf.completed ? '완료' : '진행중'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TaskAdminPageForMenuStructure;