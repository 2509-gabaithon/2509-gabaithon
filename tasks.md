# クエスト完了状況表示の改善実装計画

## 🎯 新規要件

### クエスト完了状況の正確な表示
- **完了判定ロジック**: `quest_submission` テーブルを正確に参照
- **リアルタイム更新**: 入浴完了時に即座にクエスト一覧の完了状況を反映
- **ユーザー固有**: 認証済みユーザーの完了状況のみ表示
- **視覚的改善**: 完了/未完了の明確な区別表示

## 📝 実装手順

### Step 1: クエスト完了状況取得の改善
- `/src/utils/supabase/quest.ts`
- `getQuestsWithProgress` 関数のquest_submission参照ロジック改善
- ユーザー認証状態に基づく適切なデータ取得

### Step 2: 完了状況判定の精度向上
- 各クエストごとの詳細な完了チェック
- quest_onsenとquest_submissionの正確な照合
- 部分完了と完全完了の区別

### Step 3: UI表示の改善
- `/src/components/QuestScreen.tsx`
- 完了状況の視覚的表現改善
- 進捗バーや完了率の正確な表示

### Step 4: リアルタイム更新機能
- クエスト達成通知後の一覧画面自動更新
- 状態管理の最適化

## 🗃️ 実装対象ファイル

### DB関連
1. **`/src/utils/supabase/quest.ts`**: quest_submission参照ロジック改善
2. **クエリ最適化**: JOINクエリでパフォーマンス向上

### UI関連
3. **`/src/components/QuestScreen.tsx`**: 完了状況表示の改善
4. **`/src/app/view_quest/page.tsx`**: 状態管理とリフレッシュ機能

## 🔧 データ取得戦略

### 現在の問題点
- quest_submissionの参照が簡略化されている
- 完了判定が曖昧（isCompleted vs userProgress）
- リアルタイム更新が不十分

### 改善案
```sql
-- 正確な完了状況クエリ
SELECT 
    q.id,
    q.name,
    q.created_at,
    q.lat,
    q.lng,
    COUNT(qo.id) as total_onsen_count,
    CASE 
        WHEN qs.quest_id IS NOT NULL THEN true 
        ELSE false 
    END as is_completed
FROM quest q
LEFT JOIN quest_onsen qo ON q.id = qo.quest_id
LEFT JOIN quest_submission qs ON q.id = qs.quest_id AND qs.user_id = $1
GROUP BY q.id, q.name, q.created_at, q.lat, q.lng, qs.quest_id
ORDER BY q.id;
```

## 🎨 UI改善ポイント

### 完了状況の視覚化
- **完了済み**: ✅ チェックマーク + グリーンボーダー
- **未完了**: ⚪ 空サークル + グレーボーダー
- **進捗表示**: 対象温泉数 / 完了状況

### リアルタイム更新
- クエスト達成通知後の自動リフレッシュ
- 楽観的UI更新での体験向上

## 🗃️ データベーススキーマ（参考）

### questテーブル
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
- 大量のクエストデータでのパフォーマンス
- ネットワーク遅延時のローディング状態
- キャッシュ戦略の検討
- エラー時のフォールバック表示
- quest_submissionの正確な参照による完了判定
