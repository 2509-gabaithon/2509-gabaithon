import { createClient } from './client'
import { checkAndCompleteQuests, QuestCompletionResult } from './quest'

export interface NyuyokuLogData {
  user_id: string;
  total_ms: number;
  started_at: string; // ISO 8601 format
  ended_at: string;   // ISO 8601 format
  onsen_name: string;
  onsen_place_id: string;
  onsen_lat: number;
  onsen_lng: number;
}

export interface NyuyokuLogResult {
  logData: any;
  questCompletions: QuestCompletionResult[];
}

export async function insertNyuyokuLog(logData: Omit<NyuyokuLogData, 'user_id'>): Promise<NyuyokuLogResult> {
  const supabase = createClient()
  
  // 認証されたユーザーを取得
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    throw new Error(`認証エラー: ${authError.message}`)
  }
  
  if (!user) {
    throw new Error('ユーザーが認証されていません')
  }

  // nyuyoku_logテーブルにデータを挿入
  const { data, error } = await supabase
    .from('nyuyoku_log')
    .insert({
      user_id: user.id,
      ...logData
    })
    .select()

  if (error) {
    throw new Error(`入浴ログ保存エラー: ${error.message}`)
  }

  // 入浴記録保存後、クエスト達成判定を実行
  let questCompletions: QuestCompletionResult[] = [];
  try {
    questCompletions = await checkAndCompleteQuests(logData.onsen_place_id);
  } catch (questError) {
    // クエスト判定エラーは警告として記録するが、入浴ログ保存は成功とする
    console.warn('クエスト判定処理でエラーが発生しました:', questError);
  }

  return {
    logData: data,
    questCompletions
  };
}
