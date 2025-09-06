"use client";

import { ResultScreen } from "@/components/ResultScreen";
import onsenStamp from "@/assets/23d72f267674d7a86e5a4d3966ba367d52634bd9.png";

export default function ConfirmOnkatsuResult() {
  const expGained = 50; // 獲得経験値の例
  const levelUp = true; // レベルアップしたかどうかの例
  const newLevel = 6; // 新しいレベルの例
  const character = {
    name: "温泉ちゃん",
    type: "onsen-chan",
    level: 5,
    exp: 150,
    maxExp: 200,
    happiness: 80,
    stamina: 60,
    onsenCount: 3,
  };

  const acquiredStamp = {
    name: "温泉スタンプ",
    icon: onsenStamp.src,
  };

  const handleContinue = () => {
    console.log("キャラクター画面へ移動");
  };

  return (
    <ResultScreen
      expGained={expGained}
      levelUp={levelUp}
      newLevel={newLevel}
      character={character}
      acquiredStamp={acquiredStamp}
      onContinue={handleContinue}
    />
  );
}
