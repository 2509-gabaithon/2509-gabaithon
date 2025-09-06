"use client";

import { HomeScreen } from "@/components/HomeScreen";

export default function Home() {
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

  const handleNavigateToStampRally = () => {
    console.log("スタンプラリーへ移動");
  };

  const handleNavigateToDecoration = () => {
    console.log("デコレーションへ移動");
  };

  const handleTabChange = (tab: string) => {
    console.log("選択されたタブ:", tab);
  };

  return (
    <HomeScreen
      character={character}
      onNavigateToStampRally={handleNavigateToStampRally}
      onNavigateToDecoration={handleNavigateToDecoration}
      onTabChange={handleTabChange}
    />
  );
}
