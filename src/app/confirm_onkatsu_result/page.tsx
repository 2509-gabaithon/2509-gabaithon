"use client";

import { ResultScreen } from "@/components/ResultScreen";
import onsenStamp from "@/assets/23d72f267674d7a86e5a4d3966ba367d52634bd9.png";
import characterImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';

export default function ConfirmOnkatsuResult() {
  const expGained = 50;
  const levelUp = false;
  const character = {
    name: "もちもちうさぎ",
    image: characterImage.src,
    level: 5,
    exp: 150,
    maxExp: 200,
  };

  const acquiredStamp = {
    name: "温泉スタンプ",
    icon: onsenStamp.src,
  };

  const handleNavigateToDecoration = () => {
    console.log("キャラクター画面へ移動");
  };

  return (
    <ResultScreen
      expGained={expGained}
      levelUp={levelUp}
      character={character}
      acquiredStamp={acquiredStamp}
      onNavigateToDecoration={handleNavigateToDecoration}
    />
  );
}
