// src/api/apiForMenuAdmin.ts
import getSupabase from '@/lib/supabaseClient';
import { 
  IMenuStructure, 
  IResponseSingleMenuStructure,
  IRequestParameterForApiForCreateMenuStructure,
  IRequestParameterForApiForUpdateMenuStructure
} from '@/type/typeForMenuStructure';

export const apiForGetMenuStructureList = async (): Promise<IMenuStructure[]> => {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase 초기화 실패');
  }

  const { data, error } = await supabase
    .from('menu_structures')
    .select(`
      id,
      menu_structure,
      classification,
      description,
      created_by,
      created_at,
      updated_at,
      title,
      users (
        email,
        profile (
          user_image
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`메뉴 구조 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`);
  }

  // 디버깅을 위한 데이터 출력
  console.log("Raw data from Supabase:", data);

  return data as unknown as IMenuStructure[];
};

export async function apiForGetMenuStructure(id: number): Promise<IResponseSingleMenuStructure> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('menu_structures')
      .select(`
        id,
        menu_structure,
        classification,
        description,
        created_by,
        created_at,
        updated_at,
        users:created_by (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as unknown as IMenuStructure,
      error: null
    };
  } catch (error) {
    console.error(`Failed to fetch menu structure with id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch menu structure'
    };
  }
}

export async function apiForCreateMenuStructure(
  params: IRequestParameterForApiForCreateMenuStructure
): Promise<IResponseSingleMenuStructure> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('menu_structures')
      .insert([params])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as IMenuStructure,
      error: null
    };
  } catch (error) {
    console.error('Failed to create menu structure:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create menu structure'
    };
  }
}

export async function apiForUpdateMenuStructure(
  params: IRequestParameterForApiForUpdateMenuStructure
): Promise<IResponseSingleMenuStructure> {
  try {
    const supabase = getSupabase();
    const { id, ...updateData } = params;

    const { data, error } = await supabase
      .from('menu_structures')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as IMenuStructure,
      error: null
    };
  } catch (error) {
    console.error('Failed to update menu structure:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update menu structure'
    };
  }
}