import { createClient } from './client'

export interface UserPartnerData {
  id: number;
  name: string;
  exp: number;
  happiness: number;
  user_id: string;
  partner_id: number;
  created_at: string;
}

export interface UserPartnerUpdate {
  exp?: number;
  happiness?: number;
  name?: string;
}

/**
 * ユーザーのパートナー情報を取得
 */
export async function getUserPartner(): Promise<UserPartnerData | null> {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('認証が必要です')
  }

  const { data, error } = await supabase
    .from('user_partner')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    throw new Error(`パートナー情報取得エラー: ${error.message}`)
  }

  return data
}

/**
 * ユーザーのパートナー情報を更新
 */
export async function updateUserPartner(updates: UserPartnerUpdate): Promise<UserPartnerData> {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log(user);
  
  
  if (authError || !user) {
    throw new Error('認証が必要です')
  }

  const { data, error } = await supabase
    .from('user_partner')
    .update(updates)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    throw new Error(`パートナー情報更新エラー: ${error.message}`)
  }

  return data
}

/**
 * 経験値と幸福度を手動で更新（デバッグ用）
 */
export async function addExperienceAndHappiness(
  expGain: number, 
  happinessGain: number
): Promise<UserPartnerData> {
  const currentPartner = await getUserPartner()
  
  if (!currentPartner) {
    throw new Error('パートナー情報が見つかりません')
  }

  const newExp = currentPartner.exp + expGain
  const newHappiness = Math.min(100, currentPartner.happiness + happinessGain)

  return updateUserPartner({
    exp: newExp,
    happiness: newHappiness
  })
}

/**
 * パートナーのレベルを計算（経験値ベース）
 */
export function calculateLevel(exp: number): number {
  // レベル計算式: レベル = floor(sqrt(exp / 100)) + 1
  // 例: 0exp = Lv1, 100exp = Lv2, 400exp = Lv3, 900exp = Lv4
  return Math.floor(Math.sqrt(exp / 100)) + 1
}

/**
 * 次のレベルまでに必要な経験値を計算
 */
export function getExpToNextLevel(exp: number): number {
  const currentLevel = calculateLevel(exp)
  const nextLevelExp = Math.pow(currentLevel, 2) * 100
  return nextLevelExp - exp
}
