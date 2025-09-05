import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Star, Droplets } from 'lucide-react';
import beppyonImage from '@/assets/3c6e9e82c814a4dcb5208e61977d5118a50e6a2c.png';
import yuttsuraImage from '@/assets/cc82c1498637df3406caa6867e011e9f0b8813d7.png';
import kawaiiImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';

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

interface CharacterScreenProps {
  character: Character;
  userName: string;
  onNavigateToStampRally: () => void;
  onNavigateToDecoration: () => void;
}

export function CharacterScreen({ character, userName, onNavigateToStampRally, onNavigateToDecoration }: CharacterScreenProps) {
  const expPercentage = (character.exp / character.maxExp) * 100;
  
  // キャラクターの種類に応じて画像を選択
  const getCharacterImage = () => {
    switch (character.type) {
      case 'onsen-chan':
        return beppyonImage;
      case 'yuzu-kun':
        return yuttsuraImage;
      case 'sakura-san':
        return kawaiiImage;
      default:
        return beppyonImage;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-accent-2 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-app-base mb-1">こんにちは、{userName}さん！</h1>
          <p className="text-app-base-light">今日も温泉の旅を楽しもう</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <img
                src={getCharacterImage()}
                alt={character.name}
                className="w-32 h-32 mx-auto object-contain mb-3"
              />
              <h2 className="text-xl font-bold text-app-base">{character.name}</h2>
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

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Heart className="h-6 w-6 text-app-main mb-1" />
                  <span className="text-sm font-medium">幸福度</span>
                  <span className="text-lg font-bold text-app-main">{character.happiness}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="h-6 w-6 text-app-accent-1-dark mb-1" />
                  <span className="text-sm font-medium">スタミナ</span>
                  <span className="text-lg font-bold text-app-accent-1-dark">{character.stamina}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <Droplets className="h-6 w-6 text-app-base mb-1" />
                  <span className="text-sm font-medium">温泉回数</span>
                  <span className="text-lg font-bold text-app-base">{character.onsenCount}回</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full"
            onClick={onNavigateToStampRally}
          >
            🗾 スタンプラリーを見る
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={onNavigateToDecoration}
          >
            ✨ キャラクターデコレーション
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-center">今日のミッション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-app-accent-1-light rounded">
                <span className="text-sm">温泉に1回入る</span>
                <Badge variant="outline">未達成</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-app-accent-2 rounded">
                <span className="text-sm">新しい温泉を発見する</span>
                <Badge className="bg-app-main">達成！</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}