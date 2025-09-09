import React from "react";

interface Character {
  name: string;
  type: string;
  level: number;
  exp: number;
  maxExp: number;
  happiness: number;
  stamina: number;
  onsenCount: number;
}

interface HomeScreenProps {
  character: Character;
  onNavigateToStampRally: () => void;
  onNavigateToDecoration: () => void;
  onTabChange?: (tab: any) => void;
}

export function HomeScreenDebug({
  character,
  onNavigateToStampRally,
  onNavigateToDecoration,
  onTabChange,
}: HomeScreenProps) {
  console.log('🏠 HomeScreenDebug rendering with character:', character);

  return (
    <div className="min-h-screen bg-blue-200 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">デバッグ用ホーム画面</h1>
        <div className="space-y-2">
          <p><strong>名前:</strong> {character.name}</p>
          <p><strong>タイプ:</strong> {character.type}</p>
          <p><strong>レベル:</strong> {character.level}</p>
          <p><strong>経験値:</strong> {character.exp}/{character.maxExp}</p>
          <p><strong>幸福度:</strong> {character.happiness}%</p>
          <p><strong>温泉回数:</strong> {character.onsenCount}回</p>
        </div>
        
        <div className="mt-6 space-y-3">
          <button 
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={onNavigateToStampRally}
          >
            クエストを確認する
          </button>
          <button 
            className="w-full bg-green-500 text-white p-2 rounded"
            onClick={onNavigateToDecoration}
          >
            キャラクターデコレーション
          </button>
        </div>
      </div>
    </div>
  );
}
