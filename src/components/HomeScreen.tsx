import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Heart, Star, Droplets, Map, Sparkles } from "lucide-react";
import { BottomTabNavigation, TabType } from "./BottomTabNavigation";
import beppyonImage from "@/assets/3c6e9e82c814a4dcb5208e61977d5118a50e6a2c.png";
import yuttsuraImage from "@/assets/cc82c1498637df3406caa6867e011e9f0b8813d7.png";
import kawaiiImage from "@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png";

interface Character {
  name: string;
  type: string;
  level: number;
  exp: number;
  maxExp: number;
  happiness: number;
  onsenCount: number;
}

interface HomeScreenProps {
  character: Character;
  onNavigateToStampRally: () => void;
  onNavigateToDecoration: () => void;
  onTabChange?: (tab: TabType) => void;
}

export function HomeScreen({
  character,
  onNavigateToStampRally,
  onNavigateToDecoration,
  onTabChange,
}: HomeScreenProps) {
  const expPercentage = (character.exp / character.maxExp) * 100;

  // キャラクターの種類に応じて画像を選択
  const getCharacterImage = () => {
    switch (character.type) {
      case "onsen-chan":
        return beppyonImage;
      case "yuzu-kun":
        return yuttsuraImage;
      case "sakura-san":
        return kawaiiImage;
      default:
        return beppyonImage;
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main p-4 flex items-center justify-center pb-32">
      <div className="max-w-md mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <img
                src={getCharacterImage().src}
                alt={character.name}
                className="w-32 h-32 mx-auto object-contain mb-3"
              />
              <h2 className="text-xl font-bold text-app-base">
                {character.name}
              </h2>
              <Badge variant="secondary" className="mt-1">
                レベル {character.level}
              </Badge>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">経験値</span>
                  <span className="text-sm text-app-base-light">
                    {character.exp} / {character.maxExp}
                  </span>
                </div>
                <Progress value={expPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 text-center">
                <div className="flex flex-col items-center">
                  <Heart className="h-6 w-6 text-app-main mb-1" />
                  <span className="text-sm font-medium">幸福度</span>
                  <span className="text-lg font-bold text-app-main">
                    {character.happiness}%
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Droplets className="h-6 w-6 text-app-base mb-1" />
                  <span className="text-sm font-medium">温泉回数</span>
                  <span className="text-lg font-bold text-app-base">
                    {character.onsenCount}回
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button size="lg" className="w-full" onClick={onNavigateToStampRally}>
            <Map />
            スタンプラリーを見る
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onNavigateToDecoration}
          >
            <Sparkles className="text-app-accent-1-dark" />
            キャラクターデコレーション
          </Button>
        </div>
      </div>

      <BottomTabNavigation activeTab="home" onTabChange={handleTabChange} />
    </div>
  );
}
