#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// 環境変数の確認
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ 環境変数が設定されていません:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SERVICE_ROLE_KEY:', !!serviceRoleKey);
  process.exit(1);
}

// Service Role権限でSupabaseクライアントを作成
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deleteUser(email) {
  try {
    console.log(`🔍 ユーザー検索中: ${email}`);
    
    // メールアドレスでユーザーを検索
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`ユーザー一覧取得エラー: ${listError.message}`);
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`❌ ユーザーが見つかりません: ${email}`);
      return;
    }

    console.log(`✅ ユーザーが見つかりました:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   作成日: ${user.created_at}`);
    console.log(`   最終ログイン: ${user.last_sign_in_at || '未ログイン'}`);

    // 確認プロンプト
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise((resolve) => {
      rl.question(`\n⚠️  このユーザーを削除しますか？ (y/N): `, resolve);
    });
    
    rl.close();

    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('🚫 削除をキャンセルしました');
      return;
    }

    console.log('🗑️  ユーザー削除中...');

    // 関連データの削除（カスケード削除でSupabaseが自動処理）
    // user_partner, profile, nyuyoku_log などは外部キー制約で自動削除される

    // ユーザーアカウントの削除
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('❌ ユーザー削除エラーの詳細:');
      console.error('   Message:', deleteError.message);
      console.error('   Code:', deleteError.code);
      console.error('   Details:', deleteError.details);
      console.error('   Hint:', deleteError.hint);
      throw new Error(`ユーザー削除エラー: ${deleteError.message}`);
    }

    console.log('✅ ユーザーが正常に削除されました');
    console.log('   - auth.users からユーザーアカウントを削除');
    console.log('   - 関連するprofile, user_partner, nyuyoku_logなどのデータも自動削除');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// コマンドライン引数の処理
const email = process.argv[2];

if (!email) {
  console.error('❌ 使用方法: npm run delete-user <email>');
  console.error('   例: npm run delete-user user@example.com');
  process.exit(1);
}

// メールアドレスの簡単なバリデーション
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ 無効なメールアドレス形式です:', email);
  process.exit(1);
}

// 削除実行
deleteUser(email);
