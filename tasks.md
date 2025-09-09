# クエスト表示機能のDB連携実装計画

## 🎯 実装方針

### questテーブルを触らない制約下での対応
- `difficulty` と `image_url` カラムは追加しない
- 既存のDBスキーマ (`quest.id`, `quest.name`, `quest.created_at`) のみ使用
- フロントエンド側で固定値または計算値として補完

## 📝 実装手順

### Step 1: DB連携関数の実装
- `/src/utils/supabase/quest.ts` 新規作成
- クエスト取得関数
- ユーザー完了状況判定関数

### Step 2: 型定義の更新
- `Quest` インターフェースをDBスキーマに合わせて修正
- `difficulty`, `image` は固定値またはオプショナルに

### Step 3: コンポーネント修正
- `mockQuests` → DB取得データに置換
- 完了状況の動的判定
- エラーハンドリング追加

### Step 4: ページ統合
- `/src/app/view_quest/page.tsx` でDB連携実装

## 🗃️ 利用するDBテーブル

### quest
```sql
- id: bigint (PK)
- name: text
- created_at: timestamp
```

### quest_submission  
```sql
- user_id: uuid (PK)
- quest_id: bigint (FK)
- created_at: timestamp
```

### quest_onsen
```sql
- id: bigint (PK)
- place_id: text
- lat: double precision
- lng: double precision
- quest_id: bigint (FK)
```

## 🔧 固定値での補完方法

### difficulty
- questのidまたは名前から判定
- デフォルト: "初級"

### image
- 共通のstampImage.srcを使用
- 将来的に個別対応可能な設計

## 📦 成果物

1. `/src/utils/supabase/quest.ts` - DB連携関数
2. `/src/components/QuestScreen.tsx` - DB対応版
3. `/src/app/view_quest/page.tsx` - 統合版
4. 型定義の更新
