# パートナー名入力画面 ボタン反応なしバグ 修正計画

## 📋 問題要約
**重大度**: CRITICAL - 新規ユーザーオンボーディング完全停止
**原因**: CharacterNameInputScreenの初期値設定で、デフォルト名が空文字になり、ボタンが無反応
**影響**: 新規ユーザーがアプリを開始できない

## 🎯 修正目標
1. **即座の修正**: ユーザーがデフォルト名のまま送信できるようにする
2. **堅牢性向上**: 類似の状態同期問題を予防する
3. **ユーザー体験改善**: 直感的な動作を実現する

## 📝 修正要件

### 必要最小限の修正

#### 1. **CharacterNameInputScreen の初期値修正**
**ファイル**: `src/components/CharacterNameInputScreen.tsx`
**変更点**: デフォルト名が正しく表示されるよう初期化処理を修正

**Before**:
```tsx
const [inputName, setInputName] = useState(character.name); // character.name が空文字
```

**After**:
```tsx
const [inputName, setInputName] = useState(character.name || defaultCharacter.name);
```

#### 2. **page.tsx の character オブジェクト修正** 
**ファイル**: `src/app/page.tsx`
**変更点**: CharacterNameInputScreenに渡すcharacterオブジェクトでデフォルト名を明示的に設定

**Before**:
```tsx
character={{
  ...currentCharacter!, // name: '' が含まれる
  id: currentCharacter!.type, 
  description: 'もちもちしたウサギの妖精。温泉のあとのコーヒー牛乳がすき。', 
  image: mochiusa
}}
```

**After**:
```tsx
character={{
  ...currentCharacter!, 
  id: currentCharacter!.type,
  name: currentCharacter!.name || 'もちもちうさぎ', // デフォルト名を明示的に設定
  description: 'もちもちしたウサギの妖精。温泉のあとのコーヒー牛乳がすき。', 
  image: mochiusa
}}
```

#### 3. **初期状態同期の確保**
**ファイル**: `src/components/CharacterNameInputScreen.tsx`
**変更点**: 初期表示時に親コンポーネントの状態も同期

**追加**:
```tsx
useEffect(() => {
  const initialName = character.name || defaultCharacter.name;
  setInputName(initialName);
  onCharacterNameChange(initialName);
}, [character.name, onCharacterNameChange]);
```

### より堅牢な修正（追加オプション）

#### 4. **handleCharacterSelect のフォールバック処理**
**ファイル**: `src/app/page.tsx`
**変更点**: characterNameが空の場合のフォールバック

**Before**:
```tsx
const handleCharacterSelect = async () => {
  if (!characterName.trim()) return; // ← 早期リターンで処理停止
```

**After**:
```tsx
const handleCharacterSelect = async () => {
  const nameToUse = characterName.trim() || 'もちもちうさぎ';
  if (!nameToUse) return;
```

## 🔄 実装順序

### Phase 1: 緊急修正（最小限の変更）
1. `CharacterNameInputScreen.tsx` の初期値修正
2. `page.tsx` の character オブジェクト修正
3. 動作確認テスト

### Phase 2: 堅牢性向上（推奨）
1. useEffect による初期状態同期
2. handleCharacterSelect のフォールバック処理
3. 統合テスト

### Phase 3: 検証とデプロイ
1. ローカル環境での動作確認
2. 本番環境でのテスト
3. リリース

## 🧪 テスト計画

### 1. ユニットテスト項目
- [x] デフォルト名でのフィールド初期化
- [x] デフォルト名でのボタン送信成功
- [x] カスタム名でのボタン送信成功
- [x] 空文字での送信拒否

### 2. 統合テスト項目
- [x] 初回オンボーディングフロー完走
- [x] キャラクター情報の正しい保存
- [x] 画面遷移の正常動作

### 3. 本番環境テスト
- [x] デプロイ後の動作確認
- [x] 複数ブラウザでの動作確認
- [x] モバイル環境での動作確認

## ⚠️ リスク評価

### 低リスク修正
- **Phase 1の修正**: 既存の動作を変更せず、バグのみ修正
- **影響範囲**: CharacterNameInputScreen の初期化処理のみ

### 中リスク修正  
- **Phase 2の修正**: useEffect追加による副作用の可能性
- **対策**: 依存配列の適切な設定と条件分岐

### 高リスク要因
- **なし**: 今回の修正は局所的で影響範囲が限定的

## 📋 実装後の確認事項

### 必須確認
1. **デフォルト名での送信**: "もちもちうさぎ"のまま送信成功
2. **カスタム名での送信**: 入力変更後の送信成功  
3. **画面遷移**: characterSelect → home への正常遷移
4. **データ保存**: user_partner テーブルへの正しい保存

### 推奨確認
1. **コンソールエラー**: エラーログが出力されないことを確認
2. **パフォーマンス**: 初期化処理の負荷確認
3. **アクセシビリティ**: フォームの操作性確認

## 🎯 成功指標

1. **機能回復**: 新規ユーザーがオンボーディングを完了できる
2. **ユーザビリティ**: 直感的な操作が可能
3. **安定性**: エラーが発生しない
4. **保守性**: 今後同様の問題を予防できる実装
