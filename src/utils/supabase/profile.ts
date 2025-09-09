import { createClient } from './client'

export interface UserProfileData {
  id: string;
  name: string;
  created_at: string;
}

export async function updateUserProfile(profile: Omit<UserProfileData, 'id' | 'created_at'>): Promise<UserProfileData> {
  const supabase = createClient()

  console.log("ユーザープロフィールの更新を開始します", {
    name: profile.name
  })

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(`認証エラー: ${authError.message}`)
  }

  if (!user) {
    throw new Error('ユーザーが認証されていません')
  }

  const { data, error } = await supabase
    .from('profile')
    .update({name: profile.name})
    .eq('id', user.id)
    .select('id, name, created_at')
    .single();
  
  if (error) {
    throw new Error(`ユーザープロフィール保存エラー: ${error.message}`)
  }

  return data
}
