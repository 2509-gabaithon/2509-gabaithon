import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import kawaiiImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { BottomTabNavigation, TabType } from './BottomTabNavigation';

interface DecoItem {
  id: string;
  name: string;
  type: 'hat' | 'accessory' | 'background' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  equipped: boolean;
  cost?: number;
  description: string;
  emoji: string;
}

interface CharacterDecoScreenProps {
  onBack: () => void;
  character: {
    name: string;
    type: string;
    level: number;
  };
  onTabChange?: (tab: TabType) => void;
}

const mockDecoItems: DecoItem[] = [
  // 帽子
  { id: 'hat1', name: '温泉帽子', type: 'hat', rarity: 'common', unlocked: true, equipped: false, description: 'クラシックな温泉帽子', emoji: '🎩' },
  { id: 'hat2', name: '桜の花冠', type: 'hat', rarity: 'rare', unlocked: true, equipped: true, description: '春の美しい桜の花冠', emoji: '🌸' },
  
  // アクセサリー
  { id: 'acc1', name: 'リボン', type: 'accessory', rarity: 'common', unlocked: true, equipped: false, description: 'かわいいリボン', emoji: '🎀' },
  { id: 'acc2', name: '温泉メダル', type: 'accessory', rarity: 'rare', unlocked: true, equipped: true, description: '温泉マスターの証', emoji: '🏅' },
  
  // 背景
  { id: 'bg1', name: '温泉背景', type: 'background', rarity: 'common', unlocked: true, equipped: true, description: 'クラシックな温泉背景', emoji: '🏔️' },
  { id: 'bg2', name: '桜背景', type: 'background', rarity: 'rare', unlocked: true, equipped: false, description: '美しい桜の背景', emoji: '🌸' },
  
  // エフェクト
  { id: 'eff1', name: 'キラキラ', type: 'effect', rarity: 'common', unlocked: true, equipped: false, description: 'キラキラ光るエフェクト', emoji: '✨' },
  { id: 'eff2', name: '温泉の湯気', type: 'effect', rarity: 'rare', unlocked: true, equipped: true, description: 'ほんわか温泉の湯気', emoji: '💨' }
];

export function CharacterDecoScreen({ onBack, character, onTabChange }: CharacterDecoScreenProps) {
  const [items, setItems] = useState(mockDecoItems);

  const equipItem = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, equipped: !item.equipped };
      }
      return item;
    }));
  };

  const handleTabChange = (tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const DecoItemCard = ({ item }: { item: DecoItem }) => (
    <Card className={`cursor-pointer transition-all bg-white/95 backdrop-blur-sm border-white/20 ${item.equipped ? 'ring-2 ring-app-main' : ''}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{item.emoji}</div>
          <h4 className="font-bold mb-3 text-app-base">{item.name}</h4>
          
          <Button
            size="sm"
            variant={item.equipped ? "default" : "outline"}
            onClick={() => equipItem(item.id)}
            className="w-full"
          >
            {item.equipped ? '装備中' : '装備する'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main relative overflow-hidden p-4 pb-32">
      {/* Background sparkles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 text-white/30 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute top-32 right-16 text-white/20 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute top-48 left-20 text-white/25 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute bottom-32 right-10 text-white/30 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-48 left-14 text-white/20 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2 p-2 text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">デコレーション</h1>
        </div>

        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={kawaiiImage.src}
                  alt={character.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-app-base">{character.name}</h3>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {items.map(item => (
            <DecoItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      
      <BottomTabNavigation 
        activeTab="none" 
        onTabChange={handleTabChange}
      />
    </div>
  );
}
