# クエスト機能改善実装計画

## 🎯 新規要件

### UI改善
- **ボタン名変更**: 「スタンプラリーを見る」→「湯けむりクエストを確認」
- **サムネイル画像**: `public/quests/{quest.id}.png` から表示

### DB拡張
- **questテーブル**: `lat`, `lng` カラム追加（将来利用予定）

## 📝 実装手順

### Step 1: questテーブルのマイグレーション
- `lat` (double precision) カラム追加
- `lng` (double precision) カラム追加
- ALTER TABLEでスキーマ更新

### Step 2: 画像パス変更
- `/src/utils/supabase/quest.ts`
- `getDefaultStampImage()` → `getQuestImage(questId)` 
- `public/quests/{quest.id}.png` パスに変更

### Step 3: UI文言修正
- ボタンテキスト変更箇所を特定
- 「スタンプラリーを見る」→「湯けむりクエストを確認」

### Step 4: 型定義更新
- `Quest`インターフェースに`lat`, `lng`プロパティ追加
- DB取得時にこれらのフィールドも含める

## 🗃️ 影響範囲

### 修正対象ファイル
1. **Supabaseマイグレーション**: questテーブルカラム追加
2. **`/src/utils/supabase/quest.ts`**: 画像パス関数、型定義、クエリ更新
3. **UI コンポーネント**: ボタン文言変更箇所
4. **`/public/quests/`**: 各questのサムネイル画像配置

### 画像ファイル要件
- ファイル名: `{quest.id}.png` (例: `1.png`, `2.png`, `3.png`)
- 配置場所: `/public/quests/`
- フォールバック: 既存の共通画像

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
