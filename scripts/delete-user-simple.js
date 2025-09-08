#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// 環境変数の確認
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ 環境変数が設定されていません');
  process.exit(1);
}

// Service Role権限でSupabaseクライアントを作成
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deleteUserSimple(email) {
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

    console.log(`✅ ユーザーが見つかりました: ${user.id}`);

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

    console.log('🗑️  Dashboard で以下のSQLを実行してください:');
    console.log('---');
    console.log(`-- ユーザー ${email} (${user.id}) の削除`);
    console.log(`DELETE FROM auth.users WHERE id = '${user.id}';`);
    console.log('---');
    console.log('');
    console.log('💡 または、Dashboard の Authentication → Users から手動で削除');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// コマンドライン引数の処理
const email = process.argv[2];

if (!email) {
  console.error('❌ 使用方法: npm run delete-user <email>');
  process.exit(1);
}

// 削除実行
deleteUserSimple(email);
