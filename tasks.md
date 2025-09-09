# 入浴完了時のクエスト達成判定機能実装計画

## 🎯 新規要件

### クエスト達成自動判定
- **入浴完了時**: ## 🗃️ データベーススキーマ（参考）

### questテーブル更新後スキーマ
```sql
CREATE TABLE quest (
    id bigint PRIMARY KEY,
    name text,
    created_at timestamp with time zone DEFAULT now(),
    lat double precision,     -- 追加済み
    lng double precision      -- 追加済み
);
```

### quest_onsenテーブル
```sql
CREATE TABLE quest_onsen (
    id bigint PRIMARY KEY,
    place_id text,           -- Google Places API place_id
    lat double precision,
    lng double precision,
    quest_id bigint REFERENCES quest(id)
);
```

### quest_submissionテーブル
```sql
CREATE TABLE quest_submission (
    user_id uuid REFERENCES auth.users(id),
    quest_id bigint REFERENCES quest(id),
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (user_id, quest_id)
);
```

## ⚠️ 考慮事項
- 同じクエストの重複達成を防ぐ（quest_submission のPKで制御）
- 複数クエスト同時達成時の通知方法
- ネットワークエラー時のリトライ処理
- ユーザー認証状態の確認
- 入浴記録とクエスト達成のトランザクション整合性ク
- **クエスト対象判定**: `quest_onsen.place_id` に該当温泉があるかで判断
- **達成記録**: クエスト対象なら `quest_submission` にデータ追加
- **クリア表示**: 達成時にユーザーに通知表示

### UI改善（完了済み）
- **ボタン名変更**: 「スタンプラリーを見る」→「湯けむりクエストを確認」
- **サムネイル画像**: `public/quests/{quest.id}.png` から表示

### DB拡張（完了済み）
- **questテーブル**: `lat`, `lng` カラム追加（将来利用予定）

## 📝 実装手順

### Step 1: クエスト達成判定関数
- `/src/utils/supabase/quest.ts`
- `checkQuestCompletion(place_id)` 関数作成
- `quest_onsen` テーブルから該当するquest_idを検索

### Step 2: 入浴完了処理拡張
- `/src/utils/supabase/nyuyoku-log.ts`
- `insertNyuyokuLog` 関数にクエスト判定処理を追加
- 入浴記録保存後にクエスト達成チェック実行

### Step 3: クエスト達成通知UI
- 達成時のポップアップ/トースト表示
- 「クエスト達成！」メッセージとスタンプ表示
- クエスト一覧への遷移ボタン

### Step 4: 統合テスト
- 入浴完了→クエスト判定→達成記録→通知表示の流れ
- 複数クエスト同時達成の処理

## 🗃️ 実装対象ファイル

### DB関連
1. **`/src/utils/supabase/quest.ts`**: クエスト達成判定関数追加
2. **`/src/utils/supabase/nyuyoku-log.ts`**: 入浴完了処理にクエスト判定統合

### UI関連
3. **入浴完了画面**: クエスト達成通知コンポーネント
4. **`/src/app/page.tsx`**: 入浴完了時の処理フロー更新

## 🔧 データフロー

### 入浴完了時の処理フロー
```
1. 入浴データを nyuyoku_log に保存
2. place_id で quest_onsen テーブルを検索
3. 該当するquest_idがあれば quest_submission に記録
4. 達成したクエスト情報をユーザーに通知
5. クエスト一覧画面の完了状況を更新
```

### 使用するDB関数
- `quest_onsen` から `place_id` で検索
- `quest_submission` に `user_id`, `quest_id` をupsert
- 達成済みクエストの重複チェック

## � データベース変更

### questテーブル更新後スキーマ
```sql
CREATE TABLE quest (
    id bigint PRIMARY KEY,
    name text,
    created_at timestamp with time zone DEFAULT now(),
    lat double precision,     -- 新規追加
    lng double precision      -- 新規追加
);
```

## ⚠️ 注意事項
- questテーブルの既存データには`lat`, `lng`は`NULL`
- 画像ファイルが存在しない場合はフォールバック表示
- 将来的に位置情報を活用した機能拡張予定
