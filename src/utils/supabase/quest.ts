import { createClient } from './client';

// Quest型定義（DBスキーマに合わせて調整）
export interface Quest {
  id: number;
  name: string;
  created_at: string;
  lat?: number;  // 新規追加
  lng?: number;  // 新規追加
  // フロントエンド用の計算フィールド
  difficulty?: string;
  image?: string;
  onsenCount?: number;
  userProgress?: number;
  isCompleted?: boolean;
}

// Onsen位置情報型
interface QuestOnsen {
  id: number;
  place_id: string;
  lat: number;
  lng: number;
  quest_id: number;
}

// クエスト完了記録型
interface QuestSubmission {
  user_id: string;
  quest_id: number;
  created_at: string;
}

// クエスト達成結果型
export interface QuestCompletionResult {
  questId: number;
  questName: string;
  wasAlreadyCompleted: boolean;
}

/**
 * 入浴した温泉がクエスト対象かチェックし、達成記録を保存
 */
export async function checkAndCompleteQuests(place_id: string): Promise<QuestCompletionResult[]> {
  const supabase = createClient();
  
  try {
    // ユーザー認証確認
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('認証が必要です');
    }

    // 入浴した温泉がクエスト対象かチェック
    const { data: questOnsens, error: onsenError } = await supabase
      .from('quest_onsen')
      .select(`
        quest_id,
        quest:quest_id (
          id,
          name
        )
      `)
      .eq('place_id', place_id);

    if (onsenError) {
      console.error('クエスト温泉検索エラー:', onsenError);
      throw new Error('クエスト対象温泉の検索に失敗しました');
    }

    if (!questOnsens || questOnsens.length === 0) {
      // クエスト対象の温泉ではない
      return [];
    }

    const results: QuestCompletionResult[] = [];

    // 各対象クエストについて達成記録を保存
    for (const questOnsen of questOnsens) {
      const questId = questOnsen.quest_id;
      const questName = (questOnsen.quest as any)?.name || 'Unknown Quest';

      // 既に達成済みかチェック
      const { data: existingSubmission, error: checkError } = await supabase
        .from('quest_submission')
        .select('quest_id')
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116は「レコードが見つからない」エラーで正常
        console.error('達成記録確認エラー:', checkError);
        continue;
      }

      const wasAlreadyCompleted = !!existingSubmission;

      if (!wasAlreadyCompleted) {
        // 新規達成として記録
        const { error: insertError } = await supabase
          .from('quest_submission')
          .insert({
            user_id: user.id,
            quest_id: questId
          });

        if (insertError) {
          console.error('クエスト達成記録エラー:', insertError);
          continue;
        }
      }

      results.push({
        questId,
        questName,
        wasAlreadyCompleted
      });
    }

    return results;

  } catch (error) {
    console.error('checkAndCompleteQuests エラー:', error);
    throw error;
  }
}

/**
 * 全クエストを取得し、ユーザーの進捗情報を付加
 */
export async function getQuestsWithProgress(): Promise<Quest[]> {
  const supabase = createClient();
  
  try {
    // ユーザー認証確認
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('認証が必要です');
    }

    // クエスト基本情報を取得
    const { data: quests, error: questError } = await supabase
      .from('quest')
      .select('id, name, created_at, lat, lng')
      .order('id', { ascending: true });

    if (questError) {
      console.error('クエスト取得エラー:', questError);
      throw new Error('クエストデータの取得に失敗しました');
    }

    if (!quests || quests.length === 0) {
      return [];
    }

    // 各クエストの対象温泉数を取得
    const { data: questOnsens, error: onsenError } = await supabase
      .from('quest_onsen')
      .select('quest_id');

    if (onsenError) {
      console.error('温泉データ取得エラー:', onsenError);
      throw new Error('温泉データの取得に失敗しました');
    }

    // ユーザーの完了記録を取得
    const { data: submissions, error: submissionError } = await supabase
      .from('quest_submission')
      .select('quest_id')
      .eq('user_id', user.id);

    if (submissionError) {
      console.error('完了記録取得エラー:', submissionError);
      throw new Error('完了記録の取得に失敗しました');
    }

    // クエスト毎の温泉数をカウント
    const onsenCounts = (questOnsens || []).reduce((acc: Record<number, number>, onsen: any) => {
      acc[onsen.quest_id] = (acc[onsen.quest_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // 完了済みクエストIDセット
    const completedQuestIds = new Set((submissions || []).map((s: any) => s.quest_id));

    // クエストデータを拡張
    const enrichedQuests: Quest[] = quests.map((quest: any) => {
      const onsenCount = onsenCounts[quest.id] || 0;
      const isCompleted = completedQuestIds.has(quest.id);
      
      return {
        ...quest,
        difficulty: getDifficultyByQuestId(quest.id),
        image: getQuestImage(quest.id),
        onsenCount,
        userProgress: isCompleted ? onsenCount : 0, // 簡略化: 完了 = 100%
        isCompleted
      };
    });

    return enrichedQuests;

  } catch (error) {
    console.error('getQuestsWithProgress エラー:', error);
    throw error;
  }
}

/**
 * 特定クエストの対象温泉一覧を取得
 */
export async function getQuestOnsens(questId: number): Promise<QuestOnsen[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('quest_onsen')
      .select('*')
      .eq('quest_id', questId);

    if (error) {
      console.error('クエスト温泉取得エラー:', error);
      throw new Error('クエスト温泉データの取得に失敗しました');
    }

    return data || [];
  } catch (error) {
    console.error('getQuestOnsens エラー:', error);
    throw error;
  }
}

/**
 * クエスト完了を記録
 */
export async function submitQuestCompletion(questId: number): Promise<void> {
  const supabase = createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('認証が必要です');
    }

    const { error } = await supabase
      .from('quest_submission')
      .upsert({
        user_id: user.id,
        quest_id: questId
      });

    if (error) {
      console.error('クエスト完了記録エラー:', error);
      throw new Error('クエスト完了の記録に失敗しました');
    }
  } catch (error) {
    console.error('submitQuestCompletion エラー:', error);
    throw error;
  }
}

/**
 * questIdから難易度を判定（固定値）
 */
function getDifficultyByQuestId(questId: number): string {
  // questIdに基づく簡単な判定ロジック
  if (questId <= 3) return '初級';
  if (questId <= 6) return '中級';
  return '上級';
}

/**
 * questIdから専用の画像パスを取得
 */
function getQuestImage(questId: number): string {
  return `/quests/${questId}.png`;
}

/**
 * デフォルトのスタンプ画像を取得（フォールバック用）
 */
function getDefaultStampImage(): string {
  // 共通のスタンプ画像パスを返す
  return '/assets/083e8d1afec77cec07a99daa65bb32f7c070dfa4.png';
}
