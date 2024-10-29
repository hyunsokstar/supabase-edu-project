// src/hooks/useApiForCreateMultiTodosWithMenuArray.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForCreateMultiTodosWithMenuArray } from '@/api/apiForTodos';
import { IRequestTypeForApiForCreateMultiTodosWithMenuArray } from '@/type/typeForTodos';
import { toast } from 'react-toastify';

const useApiForCreateMultiTodosWithMenuArray = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuData: IRequestTypeForApiForCreateMultiTodosWithMenuArray[]) =>
      apiForCreateMultiTodosWithMenuArray(menuData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
      toast.success('모든 메뉴가 성공적으로 추가되었습니다.', {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      console.error('Error creating todos:', error);
      toast.error(`할 일 추가 중 오류가 발생했습니다: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  });
};

export default useApiForCreateMultiTodosWithMenuArray;
