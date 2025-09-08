# Supabase認証問題調査レポート

## 🔍 問題の症状

**人によって認証が正常に動作する場合と `AuthSessionMissingError` が発生する場合がある**

```
User already signed in: {data: {…}, error: AuthSessionMissingError: Auth session missing!
    at eval (webpack-internal:///(app-pages-browser)…}
```

## 🚨 根本原因分析

### 1. 環境変数の整合性は確認済み ✅
すべてのSupabaseクライアント（server.ts、client.ts、middleware.ts）で同じ環境変数を使用:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. 認証フローの問題点 🔴

#### A. セッション取得のタイミング問題
```typescript
// page.tsx内での問題
const { data: { user }, error } = await supabase.auth.getSession()
```

**問題**: クライアントコンポーネントで `getSession()` を直接呼び出すと、ページロード時にセッションが準備される前に実行される可能性がある。

#### B. 認証状態の競合状態（Race Condition）
1. ユーザーがページにアクセス
2. ミドルウェアがセッションをリフレッシュ
3. 同時にクライアントコンポーネントがセッションを取得
4. タイミングによって古いまたは不完全なセッション情報を取得

#### C. コールバック後のセッション同期問題
認証コールバック後、クライアントサイドでセッション情報が更新されるまでに時間差がある。

## 🔬 技術的詳細

### AuthSessionMissingErrorの発生条件
1. **Cookieの非同期読み込み**: ブラウザでcookieが読み込まれる前にセッション取得
2. **ミドルウェアとクライアントの競合**: 同時にセッション操作を行う
3. **認証直後の状態不整合**: コールバック処理直後の一時的な状態

### 現在の実装の問題点
```typescript
// 問題のあるパターン
useEffect(() => {
  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getSession()
    // ここでエラーが発生する可能性
  }
  checkUser()
}, [])
```

## 💡 推奨解決策

### 1. 認証状態管理の改善 🚀
**onAuthStateChange**を使用した適切な認証状態監視:

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    }
  )
  return () => subscription.unsubscribe()
}, [])
```

### 2. 初期セッション取得の安全化 🛡️
```typescript
useEffect(() => {
  const getInitialSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.warn('Session error:', error.message)
        return
      }
      if (session) {
        setUser(session.user)
      }
    } catch (err) {
      console.warn('Failed to get session:', err)
    }
  }
  getInitialSession()
}, [])
```

### 3. リトライ機構の実装 🔄
```typescript
const getSessionWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (!error) return data
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)))
    } catch (err) {
      if (i === retries - 1) throw err
    }
  }
}
```

## 🎯 優先度別修正計画

### 高優先度 🔴
1. `onAuthStateChange`による認証状態監視の実装
2. 初期セッション取得のエラーハンドリング強化

### 中優先度 🟡  
1. セッション取得のリトライ機構
2. 認証状態のローディング表示

### 低優先度 🟢
1. 詳細なエラーログ
2. パフォーマンス最適化

## 🧪 テストシナリオ

### 確認すべき状況
1. **初回アクセス**: 未認証状態からの正常動作
2. **リロード**: 認証済み状態でのページリロード
3. **認証直後**: Google認証コールバック直後
4. **タブ切り替え**: 複数タブでの認証状態同期
5. **ネットワーク遅延**: 低速接続時の動作

### 人によって動作が異なる理由
- **ブラウザのcookie処理速度差**
- **ネットワーク環境の違い**
- **デバイス性能差**
- **ブラウザキャッシュ状態**

## 📊 影響度評価

| 項目 | 評価 | 説明 |
|------|------|------|
| ユーザビリティ | 🔴 高 | 認証失敗によりアプリが使用不可 |
| 発生頻度 | 🟡 中 | 環境依存で一部ユーザーに影響 |
| 修正難易度 | 🟢 低 | 標準的なSupabase認証パターンで解決可能 |

## 🎯 次のアクション

1. **即座に実装**: `onAuthStateChange`の導入
2. **エラーハンドリング**: セッション取得の安全化
3. **テスト**: 複数環境での動作確認
4. **監視**: エラーログの詳細化
