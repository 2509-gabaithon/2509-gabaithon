# Home画面固まり問題 調査報告

## 📋 問題概要
**症状**: Home画面に遷移すると画面が固まる（何も表示されない）
**発生タイミング**: キャラクター名入力後の迂回処理、およびprofile存在時の直接遷移
**影響**: ユーザーがHome画面にアクセスできない重大な問題

## 🔍 調査結果

### 1. **HomeScreenコンポーネントの構造分析**
- **依存コンポーネント**: CharacterWithAccessory, BottomTabNavigation
- **外部データ依存**: character props（必須）
- **問題の可能性**: アクセサリ取得処理での認証エラー

### 2. **CharacterWithAccessoryコンポーネントの問題発見**
**ファイル**: `src/components/CharacterWithAccessory.tsx`
**問題箇所**: 
```typescript
useEffect(() => {
  const fetchEquippedAccessary = async () => {
    try {
      setLoading(true);
      const equipped = await getEquippedAccessary(); // ← ここで固まる可能性
      setEquippedAccessary(equipped);
    } catch (error) {
      console.warn('装備中アクセサリ取得失敗:', error);
      setEquippedAccessary(null);
    } finally {
      setLoading(false);
    }
  };
  fetchEquippedAccessary();
}, []);
```

### 3. **getEquippedAccessary関数の問題点**
**ファイル**: `src/utils/supabase/accessary.ts`
**問題要因**: 
- **認証依存**: `supabase.auth.getUser()` を毎回呼び出し
- **データベースクエリ**: `user_accessary` テーブルへの複雑なJOINクエリ
- **エラーハンドリング**: 認証失敗時にthrowでエラーを投げる

**具体的な問題**:
```typescript
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  throw new Error('認証が必要です'); // ← これが原因で止まる可能性
}
```

### 4. **currentCharacterの初期値問題**
**ファイル**: `src/app/page.tsx`
**問題**: 
```typescript
const [currentCharacter, setCurrentCharacter] = useState<Character>({
  name: '', // ← 空文字
  type: 'sakura-san',
  // ...
});
```
**影響**: キャラクター名が空の状態でHome画面が呼ばれると表示に問題が発生する可能性

## 🎯 根本原因の特定

### 最も可能性の高い原因
1. **CharacterWithAccessoryコンポーネント**での`getEquippedAccessary()`呼び出し
2. **認証状態不安定**時のSupabaseクエリ実行
3. **非同期処理**でのエラーハンドリング不備

### 問題の連鎖
1. Home画面レンダリング開始
2. CharacterWithAccessoryコンポーネント初期化
3. useEffectで`getEquippedAccessary()`実行
4. 認証チェックで問題発生
5. エラーまたは無限待機状態
6. 画面が固まる

## 🛠️ 修正戦略

### 短期修正（即座の回避）
1. **デバッグ用HomeScreen**の一時的な使用
2. **CharacterWithAccessory**を一時的に無効化
3. **認証チェック**の強化

### 中期修正（根本解決）
1. **getEquippedAccessary**の認証エラーハンドリング改善
2. **CharacterWithAccessory**での適切なローディング・エラー状態管理
3. **認証状態**の安定化

### 長期修正（予防策）
1. **エラーバウンダリ**の実装
2. **コンポーネント分離**によるリスク最小化
3. **包括的なエラーハンドリング**

## 📝 次のアクション

### 即座に実行すべき対策
1. **HomeScreenDebug**を使用した原因特定
2. **CharacterWithAccessory**の一時的な無効化
3. **認証状態チェック**の追加

### 確認すべき項目
- [ ] 認証状態が不安定でないか
- [ ] getEquippedAccessary関数でエラーが発生していないか
- [ ] user_accessaryテーブルが存在するか
- [ ] 認証後のuser_idが正しく取得できているか

## ⚠️ リスク評価

**高リスク**: CharacterWithAccessoryが複数画面で使用されている場合、他の画面でも同様の問題が発生する可能性

**中リスク**: データベースの認証関連の設定に問題がある場合、全体的な機能不全の可能性

**低リスク**: 一時的な認証状態の問題であれば、適切なエラーハンドリングで解決可能
