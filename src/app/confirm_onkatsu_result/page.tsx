"use client";

import { ResultScreen } from "@/components/ResultScreen";
import onsenStamp from "@/assets/23d72f267674d7a86e5a4d3966ba367d52634bd9.png";

export default function ConfirmOnkatsuResult() {
  const expGained = 50;
  const levelUp = false;
  const character = {
    name: "もちもちうさぎ",
    type: "sakura-san",
    level: 5,
    exp: 150,
    maxExp: 200,
  };

  const acquiredStamps = [
    {
      name: "温泉スタンプ",
      icon: onsenStamp.src,
    },
    {
      name: "温泉スタンプ",
      icon: onsenStamp.src,
    },
    {
      name: "温泉スタンプ",
      icon: onsenStamp.src,
    },
  ];

  const handleNavigateToCharacter = () => {
    console.log("キャラクター画面へ移動");
  };

  return (
    <ResultScreen
      expGained={expGained}
      levelUp={levelUp}
      character={character}
      acquiredStamps={acquiredStamps}
      onNavigateToCharacter={handleNavigateToCharacter}
    />
  );
}
