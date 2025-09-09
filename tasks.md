# nyuyoku_log データ保存実装計画

## 要件分析

### nyuyoku_log テーブル構造
```sql
CREATE TABLE nyuyoku_log (
    user_id uuid NOT NULL PRIMARY KEY,
    total_ms bigint,                    -- 入浴時間(ミリ秒)
    started_at timestamp with time zone NOT NULL,  -- 開始時刻
    ended_at timestamp with time zone NOT NULL,    -- 終了時刻
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    onsen_name text,                    -- 温泉名
    onsen_place_id text NOT NULL,      -- Google Places API place_id
    onsen_lat double precision,        -- 温泉の緯度
    onsen_lng double precision         -- 温泉の経度
);
```

### 必要なデータの取得元

#### 1. タイマー関連データ (TimerScreen.tsx)
- **開始時刻**: `timeStart` (Date型)
- **終了時刻**: タイマー終了時の現在時刻
- **入浴時間**: `timeElapsed` (秒) → ミリ秒変換必要

#### 2. 温泉位置情報データ (NewLocationCheckScreen.tsx)
- **温泉名**: `onsenLocations[activeOnsenIdx].name`
- **place_id**: `onsenLocations[activeOnsenIdx].place_id`
- **緯度**: `onsenLocations[activeOnsenIdx].geometry.location.lat()`
- **経度**: `onsenLocations[activeOnsenIdx].geometry.location.lng()`

#### 3. ユーザー情報 (page.tsx)
- **user_id**: Supabase認証済みユーザーのID

## 実装対象ファイル

### src/app/page.tsx
- **役割**: アプリケーション全体の状態管理
- **必要な変更**: 
  - 選択された温泉情報の保存状態拡張
  - タイマー完了時の入浴ログ保存処理追加

### src/components/NewLocationCheckScreen.tsx
- **役割**: 温泉選択と位置確認
- **必要な変更**:
  - 選択された温泉の詳細情報をpage.tsxに渡す仕組み

### src/components/TimerScreen.tsx
- **役割**: 入浴タイマー機能
- **必要な変更**:
  - タイマー開始/終了時刻の詳細記録
  - 完了時のコールバックで温泉情報とタイマーデータを渡す

### src/utils/supabase/client.ts
- **役割**: Supabaseクライアント操作
- **必要な変更**:
  - nyuyoku_log テーブルへのINSERT関数追加

## 実装手順

### Step 1: 温泉情報の状態管理拡張
- `page.tsx` で `selectedLocation` の型定義を Google Places result 型に変更
- 温泉の詳細情報 (name, place_id, geometry) を保持

### Step 2: タイマー情報の詳細記録
- `TimerScreen.tsx` でタイマー開始時刻の正確な記録
- タイマー終了時の詳細情報をコールバックで渡す

### Step 3: Supabase保存関数の実装
- `client.ts` または新規ファイルで `insertNyuyokuLog` 関数作成
- 認証されたユーザーのIDを自動取得

### Step 4: 統合処理の実装
- `page.tsx` の `handleTimerComplete` で nyuyoku_log 保存処理を追加
- エラーハンドリングとユーザーフィードバック

## 注意事項

- **認証状態**: ユーザーが認証済みであることを確認
- **データ検証**: 必須項目 (place_id, 時刻) の存在確認
- **エラーハンドリング**: ネットワークエラー、DB制約エラーの対応
- **プライバシー**: 位置情報の適切な取り扱い

## 型定義

```typescript
interface OnsenDetail {
  name: string;
  place_id: string;
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
}

interface NyuyokuLogData {
  user_id: string;
  total_ms: number;
  started_at: string; // ISO 8601 format
  ended_at: string;   // ISO 8601 format
  onsen_name: string;
  onsen_place_id: string;
  onsen_lat: number;
  onsen_lng: number;
}
```
