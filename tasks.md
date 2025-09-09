# パートナー表示にアクセサリを含める機能 実装計画

## 調査結果

### 現在のパートナー表示箇所

1. **CharacterScreen.tsx**: メインのキャラクター画面
   - `getCharacterImage()` でキャラクター種類別の画像選択
   - `kawaiiImage` をベース画像として使用

2. **HomeScreen.tsx**: ホーム画面のキャラクター表示
   - 同様に `getCharacterImage()` を使用

3. **ResultScreen.tsx**: 入浴結果画面のキャラクター表示
   - 同様に `getCharacterImage()` を使用

4. **CharacterDecoScreen.tsx**: デコレーション画面
   - `kawaiiImage` を直接使用

5. **各種設定画面**: キャラクター選択・命名画面等
   - 初期設定時なのでアクセサリ表示は不要

### アクセサリ画像リソース

- `public/accessaries/0.png`: デフォルト画像（アクセサリなし/エラー時）
- `public/accessaries/1.png`, `2.png`, `4.png`: アクセサリ画像

## 実装要件

### 必要最小限の機能

1. **装備中アクセサリ取得機能**
   - ユーザーが装備中のアクセサリIDを取得
   - データベースから装備状態を管理する仕組み

2. **合成画像表示コンポーネント**
   - ベースキャラクター画像 + アクセサリ画像の重ね合わせ表示
   - アクセサリなし/エラー時は `0.png` を表示

3. **既存キャラクター表示箇所の置き換え**
   - `getCharacterImage()` の代わりに新しいコンポーネントを使用

### 実装対象ファイル

- `src/components/CharacterWithAccessory.tsx` - 新規作成（合成表示コンポーネント）
- `src/utils/supabase/accessary.ts` - 装備中アクセサリ取得機能追加
- `src/components/CharacterScreen.tsx` - キャラクター表示を新コンポーネントに置き換え
- `src/components/HomeScreen.tsx` - 同上
- `src/components/ResultScreen.tsx` - 同上
- `src/components/CharacterDecoScreen.tsx` - 同上

### 実装順序

1. 装備状態管理用のDB操作関数追加
2. キャラクター+アクセサリ合成表示コンポーネント作成
3. 各画面のキャラクター表示を新コンポーネントに置き換え

### 技術仕様

- **装備管理**: user_accessaryテーブルに装備フラグを追加するか、別途装備管理テーブルを作成
- **画像合成**: CSS position:absolute での重ね合わせ表示
- **フォールバック**: アクセサリ取得失敗時は `0.png`、画像読み込み失敗時も `0.png`

### 制約事項

- 同時装備は1つのアクセサリのみ（簡単化のため）
- アクセサリ画像は事前に適切なサイズ・位置で作成済みと仮定
- 初期設定画面では既存の表示を維持（アクセサリ装備前のため）
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
