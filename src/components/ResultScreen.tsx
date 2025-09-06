import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Star, Stamp, ArrowUp } from "lucide-react";
import noiseTexture from "@/assets/221bcc06007de28e2dedf86e88d0a2798eac78e7.png";
import beppyonImage from "@/assets/3c6e9e82c814a4dcb5208e61977d5118a50e6a2c.png";
import yuttsuraImage from "@/assets/cc82c1498637df3406caa6867e011e9f0b8813d7.png";
import kawaiiImage from "@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png";

interface ResultScreenProps {
  expGained: number;
  levelUp: boolean;
  newLevel?: number;
  character: {
    name: string;
    type: string;
    level: number;
    exp: number;
    maxExp: number;
  };
  acquiredStamp: { name: string; icon: string };
  onNavigateToCharacter: () => void;
}

export function ResultScreen({
  expGained,
  levelUp,
  newLevel,
  character,
  acquiredStamp,
  onNavigateToCharacter,
}: ResultScreenProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main relative overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            {levelUp && (
              <div className="mb-4">
                <div className="text-6xl">🎉</div>
                <h1 className="text-3xl text-white mb-2">レベルアップ！</h1>
                <Badge className="bg-app-main text-lg px-4 py-2">
                  <ArrowUp className="h-5 w-5 mr-1" />
                  レベル {newLevel}
                </Badge>
              </div>
            )}
            <h2 className="text-2xl text-white">オンカツ完了！</h2>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <img
                  src={getCharacterImage().src}
                  alt={character.name}
                  className="w-24 h-24 mx-auto object-contain mb-4"
                />
                <h3 className="text-xl font-bold mb-6">{character.name}</h3>

                {/* 獲得経験値プログレスバー */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-app-accent-1-dark mr-2" />
                      <span className="text-sm text-app-base-light">
                        獲得経験値
                      </span>
                    </div>
                    <span className="font-bold text-app-accent-1-dark">
                      +{expGained} EXP
                    </span>
                  </div>
                  <Progress
                    value={character.exp / character.maxExp * 100}
                    className="h-3 bg-app-accent-2-light"
                  />
                  <div className="flex justify-between text-xs text-app-base-light mt-1">
                    <span>0</span>
                    <span>{character.exp} / {character.maxExp}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <Stamp className="h-5 w-5 mr-2 text-app-base" />
                獲得スタンプ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="p-6 bg-app-accent-1-light rounded-lg">
                    {/* リアルなスタンプ表示 */}
                    <div className="relative mb-3 flex justify-center">
                      <div className="relative w-24 h-24">
                        {/* スタンプ画像 */}
                        <img
                          src={acquiredStamp.icon}
                          alt="温泉スタンプ"
                          className="w-24 h-24 object-contain relative z-10"
                          style={{
                            filter: `
                            contrast(1.2) 
                            brightness(0.9)
                            sepia(0.1)
                          `,
                          }}
                        />

                        {/* 白いノイズテクスチャオーバーレイ */}
                        <div
                          className="absolute inset-0 w-24 h-24 opacity-25 pointer-events-none z-20"
                          style={{
                            backgroundImage: `url(${noiseTexture})`,
                            backgroundSize: "100px 100px",
                            backgroundRepeat: "repeat",
                            mixBlendMode: "screen",
                            mask: `url(${acquiredStamp.icon})`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                            WebkitMask: `url(${acquiredStamp.icon})`,
                            WebkitMaskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                          }}
                        />
                      </div>
                    </div>
                    <p className="font-medium text-app-base mb-1">
                      {acquiredStamp.name}
                    </p>
                    <Badge className="bg-app-main">新規獲得</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full" onClick={onNavigateToCharacter}>
            キャラクター画面に戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
