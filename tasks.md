# クエストクリア時ランダムアクセサリ付与機能 実装計画

## 調査結果

### 現在のコードベース構造

1. **データベーススキーマ**:
   - `accessary` テーブル: アクセサリのマスタデータ（id, name）
   - `user_accessary` テーブル: ユーザーが所有するアクセサリ（user_id, accessary_id, created_at）
   - `quest_submission` テーブル: クエスト完了記録（user_id, quest_id, created_at）

2. **既存のクエスト完了機能**:
   - `src/utils/supabase/quest.ts` の `checkAndCompleteQuests` 関数
   - 温泉での入浴時にクエスト対象かチェックし、完了記録を保存
   - クエスト完了通知機能が既に実装済み

3. **アクセサリ関連の現状**:
   - データベースにaccessaryテーブルとuser_accessaryテーブルが存在
   - フロントエンドでは `CharacterDecoScreen` にmockデータとして装備システムを実装済み
   - アクセサリのSupabase操作関数は未実装

### 関連ファイル

- `/supabase/schema.sql` - データベース構造
- `/src/utils/supabase/quest.ts` - クエスト関連操作
- `/src/types/supabase.ts` - 型定義
- `/src/components/CharacterDecoScreen.tsx` - アクセサリ表示UI
- `/src/app/page.tsx` - クエスト完了通知機能

## 実装要件

### 必要最小限の機能

1. **アクセサリマスタデータの準備**
   - `accessary` テーブルにアクセサリデータを挿入するマイグレーション

2. **アクセサリ操作関数の実装**
   - ランダムアクセサリ選択機能
   - ユーザーアクセサリ付与機能
   - 重複チェック機能

3. **クエスト完了処理の拡張**
   - `checkAndCompleteQuests` 関数にアクセサリ付与ロジックを追加
   - クエスト完了通知にアクセサリ獲得情報を含める

### 実装対象ファイル

- `supabase/migrations/` - 新しいマイグレーションファイル
- `src/utils/supabase/accessary.ts` - 新規作成（アクセサリ操作）
- `src/utils/supabase/quest.ts` - 修正（アクセサリ付与機能追加）
- `src/types/` - アクセサリ型定義追加
- `src/components/QuestCompletionNotification.tsx` - アクセサリ獲得通知追加

### 実装順序

1. アクセサリマスタデータのマイグレーション作成
2. アクセサリ操作用のユーティリティ関数実装
3. クエスト完了処理にアクセサリ付与機能を統合
4. 通知UIにアクセサリ獲得表示を追加

### 制約事項

- 同じアクセサリの重複付与は避ける
- クエスト完了時のみアクセサリを付与（今回は入浴とは独立）
- ランダム性は単純な配列からのランダム選択で実装
1. `src/types/supabase.ts`の確認・更新（必要に応じて）

### Phase 3: フロントエンド連携
1. キャラクター情報取得・表示の動作確認
2. 入浴記録時の更新処理確認

## 技術的考慮点
- 幸福度の上限制約（100以下）
- 経験値のオーバーフロー対策
- 同時実行時の整合性保証
- RLS（Row Level Security）ポリシーとの整合性

## 不明点・要調査項目
1. 経験値計算の具体的なルール
2. 入浴時間以外の要素（温泉の種類、場所など）を考慮するか
3. レベルアップ機能の有無とレベル計算方法
