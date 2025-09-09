# タスク計画: user_partner 経験値・幸福度更新システム

## 概要
温泉入浴（nyuyoku_log）が記録された際に、user_partnerテーブルの経験値と幸福度を自動的に更新する機能を実装する

## 現在のスキーマ分析

### 関連テーブル
- `user_partner`: ユーザーのキャラクター情報
  - `exp`: 経験値（bigint, default 0）
  - `happiness`: 幸福度（integer, default 75）
  - `user_id`: ユーザーID（外部キー）

- `nyuyoku_log`: 温泉入浴記録
  - `user_id`: ユーザーID（主キー）
  - `total_ms`: 入浴時間（ミリ秒）
  - `started_at`, `ended_at`: 入浴開始・終了時刻

## 要件
1. 温泉入浴時に経験値を新しい経験値計算方法で更新
2. 幸福度を+25する（最大値は100）

## 実装方針

### 1. 経験値計算ロジックの決定
- 入浴時間に基づく経験値計算（例：入浴時間（分）× 10）
- または固定値での増加

### 2. 実装方法の選択
#### オプション A: データベーストリガー
- `nyuyoku_log`への INSERT 時に自動実行
- PostgreSQL 関数として実装

#### オプション B: アプリケーションレベル
- 入浴記録保存時にSupabaseクライアントで更新
- TypeScript/JavaScript で実装

### 3. 必要なファイル
- `supabase/migrations/`: 新しいマイグレーションファイル
- `src/utils/supabase/nyuyoku-log.ts`: 入浴記録関連の処理
- `src/utils/supabase/user-partner.ts`: キャラクター更新処理（新規作成予定）

## 実装タスク

### Phase 1: データベース層
1. 経験値・幸福度更新のためのPostgreSQL関数を作成
2. nyuyoku_log INSERT時のトリガー作成
3. マイグレーションファイル作成・適用

### Phase 2: TypeScript型定義更新
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
