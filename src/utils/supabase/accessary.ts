import { createClient } from './client';

// アクセサリ型定義
export interface Accessary {
  id: number;
  name: string;
}

export interface UserAccessary {
  user_id: string;
  accessary_id: number;
  created_at: string;
  accessary?: Accessary;
}

/**
 * 全てのアクセサリを取得
 */
export async function getAllAccessaries(): Promise<Accessary[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('accessary')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('アクセサリ取得エラー:', error);
    throw new Error('アクセサリの取得に失敗しました');
  }

  return data || [];
}

/**
 * ユーザーが所有するアクセサリを取得
 */
export async function getUserAccessaries(): Promise<UserAccessary[]> {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('認証が必要です');
    }

    const { data, error } = await supabase
      .from('user_accessary')
      .select(`
        *,
        accessary:accessary_id (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('ユーザーアクセサリ取得エラー:', error);
      throw new Error('ユーザーアクセサリの取得に失敗しました');
    }

    return data || [];
  } catch (error) {
    console.error('getUserAccessaries エラー:', error);
    throw error;
  }
}

/**
 * ユーザーにアクセサリを付与
 */
export async function grantAccessaryToUser(accessaryId: number): Promise<UserAccessary> {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('認証が必要です');
    }

    // 重複チェック
    const { data: existing, error: checkError } = await supabase
      .from('user_accessary')
      .select('accessary_id')
      .eq('user_id', user.id)
      .eq('accessary_id', accessaryId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('重複チェックエラー:', checkError);
      throw new Error('アクセサリの重複チェックに失敗しました');
    }

    if (existing) {
      console.log('既に所有済みのアクセサリです:', { accessaryId, userId: user.id });
      throw new Error('既に所有しているアクセサリです');
    }

    // 新規付与
    const { data, error } = await supabase
      .from('user_accessary')
      .insert({
        user_id: user.id,
        accessary_id: accessaryId
      })
      .select(`
        *,
        accessary:accessary_id (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('アクセサリ付与エラー:', error);
      throw new Error('アクセサリの付与に失敗しました');
    }

    console.log('✅ アクセサリ付与成功:', { accessaryId, userId: user.id, data });
    return data;
  } catch (error) {
    console.error('grantAccessaryToUser エラー:', error);
    throw error;
  }
}

/**
 * ランダムなアクセサリを選択（未所有のもの優先）
 */
export async function selectRandomAccessary(): Promise<Accessary | null> {
  try {
    // 全アクセサリを取得
    const allAccessaries = await getAllAccessaries();
    if (allAccessaries.length === 0) {
      console.warn('アクセサリマスタデータが存在しません');
      return null;
    }

    // ユーザーが所有済みのアクセサリIDを取得
    let ownedAccessaryIds: number[] = [];
    try {
      const userAccessaries = await getUserAccessaries();
      ownedAccessaryIds = userAccessaries.map(ua => ua.accessary_id);
    } catch (error) {
      // 認証エラーなどの場合は所有済みなしとして処理
      console.warn('ユーザーアクセサリ取得失敗（未認証の可能性）:', error);
    }

    // 未所有のアクセサリを抽出
    const unownedAccessaries = allAccessaries.filter(
      accessary => !ownedAccessaryIds.includes(accessary.id)
    );

    // 未所有があればそこからランダム、なければ全体からランダム
    const candidateAccessaries = unownedAccessaries.length > 0 ? unownedAccessaries : allAccessaries;
    
    if (candidateAccessaries.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * candidateAccessaries.length);
    const selectedAccessary = candidateAccessaries[randomIndex];

    console.log('🎲 ランダムアクセサリ選択:', {
      totalCount: allAccessaries.length,
      ownedCount: ownedAccessaryIds.length,
      unownedCount: unownedAccessaries.length,
      selectedAccessary
    });

    return selectedAccessary;
  } catch (error) {
    console.error('selectRandomAccessary エラー:', error);
    throw error;
  }
}

/**
 * ランダムアクセサリを付与（重複回避）
 */
export async function grantRandomAccessary(): Promise<{ accessary: Accessary; granted: boolean }> {
  try {
    const selectedAccessary = await selectRandomAccessary();
    
    if (!selectedAccessary) {
      throw new Error('付与可能なアクセサリが見つかりません');
    }

    try {
      await grantAccessaryToUser(selectedAccessary.id);
      console.log('✅ ランダムアクセサリ付与成功:', selectedAccessary);
      return { accessary: selectedAccessary, granted: true };
    } catch (error) {
      if (error instanceof Error && error.message.includes('既に所有している')) {
        console.log('ℹ️ 既に所有済みのアクセサリでした:', selectedAccessary);
        return { accessary: selectedAccessary, granted: false };
      }
      throw error;
    }
  } catch (error) {
    console.error('grantRandomAccessary エラー:', error);
    throw error;
  }
}
