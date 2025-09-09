// アクセサリ関連の型定義
export interface Accessary {
  id: number;
  name: string;
}

export interface UserAccessary {
  user_id: string;
  accessary_id: number;
  created_at: string;
  accessary?: Accessary;
}

// クエスト達成時のアクセサリ付与結果型
export interface AccessaryGrantResult {
  accessary: Accessary;
  granted: boolean; // true: 新規付与, false: 既に所有済み
}
