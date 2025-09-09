# クエスト表示機能調査レポート

## 🔍 発見事項

### クエスト表示コンポーネントの特定
- **ファイル**: `/src/components/QuestScreen.tsx` 
- **表示ページ**: `/src/app/view_quest/page.tsx`
- **コンポーネント名**: `StampRallyScreen` (実際はクエスト一覧表示)

### 現在の実装状況
- **現状**: テストデータ (`mockQuests`) を使用
- **問題**: DBとの連携が未実装

### テストデータの詳細
```typescript
const mockQuests: Quest[] = [
  {
    id: 1,
    name: "初回入浴クエスト",
    image: stampImage.src,
    completed: true,
    difficulty: "初級"
  },
  {
    id: 2,
    name: "長湯マスタークエスト", 
    image: stampImage.src,
    completed: false,
    difficulty: "上級"
  },
  {
    id: 3,
    name: "リラックスクエスト",
    image: stampImage.src,
    completed: false,
    difficulty: "中級"
  }
];
```

## 🗃️ データベーススキーマ分析

### quest テーブル
```sql
CREATE TABLE "public"."quest" (
    "id" bigint NOT NULL,
    "name" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

### quest_onsen テーブル（クエスト対象温泉）
```sql
CREATE TABLE "public"."quest_onsen" (
    "id" bigint NOT NULL,
    "place_id" text NOT NULL,
    "lat" double precision,
    "lng" double precision,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "quest_id" bigint
);
```

### quest_submission テーブル（クエスト提出状況）
```sql
CREATE TABLE "public"."quest_submission" (
    "user_id" uuid NOT NULL,
    "quest_id" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

## 🔄 必要な修正箇所

### 1. 型定義の不整合
**問題**: コンポーネントの `Quest` インターフェースとDBスキーマの相違

**コンポーネント側**:
```typescript
interface Quest {
  id: number;
  name: string;
  image: string;      // ← DBにない
  completed: boolean; // ← DBから計算必要
  difficulty: string; // ← DBにない
}
```

**DBスキーマ**:
- `quest.name` (text)
- `quest_submission.user_id` で完了判定
- `image`, `difficulty` カラムが存在しない

### 2. DB連携未実装
- Supabaseからのクエストデータ取得機能がない
- ユーザー固有の完了状況の判定ロジックがない
- 対象温泉情報の取得がない

## 🎯 推奨対応方針

### A. DBスキーマに準拠した修正
1. **questテーブルにカラム追加**
   ```sql
   ALTER TABLE quest ADD COLUMN difficulty text;
   ALTER TABLE quest ADD COLUMN image_url text;
   ```

2. **型定義の更新**
   ```typescript
   interface Quest {
     id: number;
     name: string;
     difficulty: string;
     image_url: string;
     completed: boolean; // quest_submissionから計算
     target_onsens?: OnsenInfo[]; // quest_onsenから取得
   }
   ```

### B. Supabase連携関数の実装
1. **クエスト取得関数**
   ```typescript
   async function fetchQuests(userId: string) {
     // quest + quest_submission JOIN
     // 完了状況を動的計算
   }
   ```

2. **対象温泉取得関数**
   ```typescript
   async function fetchQuestOnsens(questId: number) {
     // quest_onsenからplace_id, 座標取得
   }
   ```

## 📁 関連ファイル

### 実装対象
- `/src/components/QuestScreen.tsx` - メインコンポーネント
- `/src/app/view_quest/page.tsx` - ページコンポーネント
- `/src/utils/supabase/` - DB連携関数（新規作成）

### DB関連
- `/supabase/schema.sql` - テーブル定義
- `/src/types/supabase.ts` - 型定義

## ⚠️ 注意点

1. **RLSポリシー**: questテーブルは既に読み取り可能だが、quest_submissionはユーザー制限あり
2. **データの整合性**: 現在のmockQuestsの3件をDBに移行する必要性
3. **画像管理**: 現在は同一のstampImage.srcを使用、個別画像の保存方法要検討
