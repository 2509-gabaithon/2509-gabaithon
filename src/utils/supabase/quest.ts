import { createClient } from './client';
import { grantRandomAccessary } from './accessary';
import { AccessaryGrantResult } from '@/types/accessary';

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
  accessaryReward?: AccessaryGrantResult; // アクセサリ報酬情報を追加
}

/**
 * 入浴した温泉がクエスト対象かチェックし、達成記録を保存
 */
export async function checkAndCompleteQuests(place_id: string): Promise<QuestCompletionResult[]> {
  const supabase = createClient();
  
  console.log('🚀 クエスト達成チェック開始:', { place_id });
  
  try {
    // ユーザー認証確認
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('❌ 認証エラー:', authError);
      throw new Error('認証が必要です');
    }

    console.log('✅ ユーザー認証OK:', { userId: user.id });

    // 入浴した温泉がクエスト対象かチェック（シンプルなクエリに変更）
    const { data: questOnsens, error: onsenError } = await supabase
      .from('quest_onsen')
      .select('quest_id')
      .eq('place_id', place_id);

    console.log('🔍 クエスト対象温泉検索（シンプル版）:', {
      place_id,
      questOnsens,
      onsenError,
      foundCount: questOnsens?.length || 0,
      rawQuestOnsens: questOnsens?.map(qo => ({
        quest_id: qo.quest_id,
        quest_id_type: typeof qo.quest_id
      }))
    });

    if (onsenError) {
      console.error('クエスト温泉検索エラー:', onsenError);
      throw new Error('クエスト対象温泉の検索に失敗しました');
    }

    if (!questOnsens || questOnsens.length === 0) {
      console.log('ℹ️ クエスト対象外の温泉です');
      return [];
    }

    // 各対象クエストの詳細情報を取得
    const results: QuestCompletionResult[] = [];

    for (const questOnsen of questOnsens) {
      const questId = questOnsen.quest_id;

      // questIdのnullチェック
      if (!questId || questId === null) {
        console.warn('⚠️ quest_id が null です。データ不整合の可能性:', {
          questOnsen,
          place_id
        });
        continue;
      }

      // クエスト詳細情報を取得
      const { data: questDetails, error: questError } = await supabase
        .from('quest')
        .select('id, name')
        .eq('id', questId)
        .single();

      if (questError) {
        console.error('クエスト詳細取得エラー:', questError);
        continue;
      }

      const questName = questDetails?.name || 'Unknown Quest';

      console.log('🎯 クエスト達成処理:', { questId, questName });

      // 既に達成済みかチェック
      const { data: existingSubmission, error: checkError } = await supabase
        .from('quest_submission')
        .select('quest_id')
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .single();

      console.log('📋 既存記録チェック:', {
        questId,
        existingSubmission,
        checkError,
        errorCode: checkError?.code
      });

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116は「レコードが見つからない」エラーで正常
        console.error('達成記録確認エラー:', checkError);
        continue;
      }

      const wasAlreadyCompleted = !!existingSubmission;
      let accessaryReward: AccessaryGrantResult | undefined;

      if (!wasAlreadyCompleted) {
        console.log('💾 新規達成記録を保存:', { questId, userId: user.id });
        
        // 新規達成として記録
        const { data: insertData, error: insertError } = await supabase
          .from('quest_submission')
          .insert({
            user_id: user.id,
            quest_id: questId
          })
          .select();

        console.log('💾 保存結果:', {
          questId,
          insertData,
          insertError
        });

        if (insertError) {
          console.error('❌ クエスト達成記録エラー:', insertError);
          continue;
        } else {
          console.log('✅ クエスト達成記録成功:', { questId, questName });
          
          // 🎁 新規達成時にランダムアクセサリを付与
          try {
            console.log('🎁 ランダムアクセサリ付与を開始:', { questId, questName });
            accessaryReward = await grantRandomAccessary();
            console.log('✅ アクセサリ付与完了:', accessaryReward);
          } catch (accessaryError) {
            console.error('❌ アクセサリ付与エラー:', accessaryError);
            // アクセサリ付与に失敗してもクエスト達成は継続
          }
        }
      } else {
        console.log('ℹ️ 既に達成済み:', { questId, questName });
      }

      results.push({
        questId,
        questName,
        wasAlreadyCompleted,
        accessaryReward
      });
    }

    return results;

  } catch (error) {
    console.error('checkAndCompleteQuests エラー:', error);
    throw error;
  }
}

/**
 * 全クエストを取得し、ユーザーの進捗情報を付加（改善版）
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

    // ユーザーの完了記録を取得（quest_submissionから正確に参照）
    const { data: submissions, error: submissionError } = await supabase
      .from('quest_submission')
      .select('quest_id')
      .eq('user_id', user.id);

    console.log('🔍 quest_submission查询结果:', {
      userId: user.id,
      submissions,
      submissionError,
      submissionCount: submissions?.length || 0
    });

    if (submissionError) {
      console.error('完了記録取得エラー:', submissionError);
      throw new Error('完了記録の取得に失敗しました');
    }

    // クエスト毎の温泉数をカウント
    const onsenCounts = (questOnsens || []).reduce((acc: Record<number, number>, onsen: any) => {
      acc[onsen.quest_id] = (acc[onsen.quest_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // 完了済みクエストIDセット（quest_submissionから正確に取得）
    const completedQuestIds = new Set((submissions || []).map((s: any) => s.quest_id));

    console.log('🎯 完了状況判定:', {
      questCount: quests.length,
      completedQuestIds: Array.from(completedQuestIds),
      onsenCounts
    });

    // クエストデータを拡張
    const enrichedQuests: Quest[] = quests.map((quest: any) => {
      const onsenCount = onsenCounts[quest.id] || 0;
      const isCompleted = completedQuestIds.has(quest.id);
      
      return {
        ...quest,
        difficulty: getDifficultyByQuestId(quest.id),
        image: getQuestImage(quest.id),
        onsenCount,
        userProgress: isCompleted ? onsenCount : 0,
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
