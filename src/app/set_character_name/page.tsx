"use client";

import { CharacterNameInputScreen } from "@/components/CharacterNameInputScreen";
import kawaiiImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';

export default function SetCharacterName() {

  const userName = "ユーザー名";
  const character = {
    id: "sakura-san",
    name: "もちもちうさぎだよ",
    description: "あなたの温泉パートナー",
    image: kawaiiImage
  };

  const handleBack = () => {
    console.log("Back button clicked");
  };

  const handleCharacterNameChange = (name: string) => {
    console.log("Character name changed to:", name);
  };

  const handleComplete = () => {
    console.log("Character naming completed");
  };

  return (
    <CharacterNameInputScreen
      userName={userName}
      character={character}
      onBack={handleBack}
      onCharacterNameChange={handleCharacterNameChange}
      onComplete={handleComplete}
    />
  )
}
