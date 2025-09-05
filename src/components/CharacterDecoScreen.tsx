import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import kawaiiImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';
import { ArrowLeft, Palette, Star, Gift, Lock } from 'lucide-react';
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
  { id: 'hat3', name: '金の王冠', type: 'hat', rarity: 'legendary', unlocked: false, cost: 100, description: '伝説の金の王冠', emoji: '👑' },
  
  // アクセサリー
  { id: 'acc1', name: 'リボン', type: 'accessory', rarity: 'common', unlocked: true, equipped: false, description: 'かわいいリボン', emoji: '🎀' },
  { id: 'acc2', name: '温泉メダル', type: 'accessory', rarity: 'rare', unlocked: true, equipped: true, description: '温泉マスターの証', emoji: '🏅' },
  { id: 'acc3', name: '虹のネックレス', type: 'accessory', rarity: 'epic', unlocked: false, cost: 50, description: '美しい虹色のネックレス', emoji: '🌈' },
  
  // 背景
  { id: 'bg1', name: '温泉背景', type: 'background', rarity: 'common', unlocked: true, equipped: true, description: 'クラシックな温泉背景', emoji: '🏔️' },
  { id: 'bg2', name: '桜背景', type: 'background', rarity: 'rare', unlocked: true, equipped: false, description: '美しい桜の背景', emoji: '🌸' },
  { id: 'bg3', name: '星空背景', type: 'background', rarity: 'epic', unlocked: false, cost: 75, description: '幻想的な星空背景', emoji: '✨' },
  
  // エフェクト
  { id: 'eff1', name: 'キラキラ', type: 'effect', rarity: 'common', unlocked: true, equipped: false, description: 'キラキラ光るエフェクト', emoji: '✨' },
  { id: 'eff2', name: '温泉の湯気', type: 'effect', rarity: 'rare', unlocked: true, equipped: true, description: 'ほんわか温泉の湯気', emoji: '💨' },
  { id: 'eff3', name: 'オーロラ', type: 'effect', rarity: 'legendary', unlocked: false, cost: 150, description: '神秘的なオーロラエフェクト', emoji: '🌌' }
];

export function CharacterDecoScreen({ onBack, character, onTabChange }: CharacterDecoScreenProps) {
  const [items, setItems] = useState(mockDecoItems);
  const [coins, setCoins] = useState(85); // プレイヤーのコイン数

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-app-base-light';
      case 'rare': return 'bg-app-main';
      case 'epic': return 'bg-app-base';
      case 'legendary': return 'bg-app-accent-1-dark';
      default: return 'bg-app-base-light';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'コモン';
      case 'rare': return 'レア';
      case 'epic': return 'エピック';
      case 'legendary': return 'レジェンダリー';
      default: return 'コモン';
    }
  };

  const equipItem = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        // 同じタイプの他のアイテムを装備解除
        const updatedItems = prev.map(prevItem => 
          prevItem.type === item.type && prevItem.id !== itemId 
            ? { ...prevItem, equipped: false }
            : prevItem
        );
        return { ...item, equipped: !item.equipped };
      }
      return item;
    }));
  };

  const unlockItem = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item && item.cost && coins >= item.cost) {
      setCoins(prev => prev - item.cost!);
      setItems(prev => prev.map(prevItem => 
        prevItem.id === itemId ? { ...prevItem, unlocked: true } : prevItem
      ));
    }
  };

  const getItemsByType = (type: string) => {
    return items.filter(item => item.type === type);
  };

  const equippedItems = items.filter(item => item.equipped);

  const handleTabChange = (tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const DecoItemCard = ({ item }: { item: DecoItem }) => (
    <Card className={`cursor-pointer transition-all ${item.equipped ? 'ring-2 ring-app-main' : ''}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{item.emoji}</div>
          <h4 className="font-bold mb-1">{item.name}</h4>
          <Badge className={`${getRarityColor(item.rarity)} text-xs mb-2`}>
            {getRarityText(item.rarity)}
          </Badge>
          <p className="text-xs text-app-base-light mb-3">{item.description}</p>
          
          {item.unlocked ? (
            <Button
              size="sm"
              variant={item.equipped ? "default" : "outline"}
              onClick={() => equipItem(item.id)}
              className="w-full"
            >
              {item.equipped ? '装備中' : '装備する'}
            </Button>
          ) : (
            <div>
              <div className="flex items-center justify-center mb-2">
                <Lock className="h-4 w-4 text-app-base-light mr-1" />
                <span className="text-sm text-app-base-light">
                  {item.cost} コイン
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => unlockItem(item.id)}
                disabled={coins < (item.cost || 0)}
                className="w-full"
              >
                解放する
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-accent-1-light to-white p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-2 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-app-base">デコレーション</h1>
          </div>
          <div className="flex items-center bg-app-accent-1-light px-3 py-1 rounded-full">
            <span className="text-lg mr-1">💰</span>
            <span className="font-bold text-app-base">{coins}</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">プレビュー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={kawaiiImage}
                  alt={character.name}
                  className="w-full h-full rounded-full object-contain bg-app-accent-2"
                />
                {/* エフェクト表示 */}
                {equippedItems.filter(item => item.type === 'effect').map(item => (
                  <div key={item.id} className="absolute -top-2 -right-2 text-2xl animate-pulse">
                    {item.emoji}
                  </div>
                ))}
              </div>
              <h3 className="font-bold mb-2">{character.name}</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {equippedItems.map(item => (
                  <Badge key={item.id} variant="secondary" className="text-xs">
                    {item.emoji} {item.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="hat" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hat">帽子</TabsTrigger>
            <TabsTrigger value="accessory">装飾</TabsTrigger>
            <TabsTrigger value="background">背景</TabsTrigger>
            <TabsTrigger value="effect">エフェクト</TabsTrigger>
          </TabsList>

          <TabsContent value="hat" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {getItemsByType('hat').map(item => (
                <DecoItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accessory" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {getItemsByType('accessory').map(item => (
                <DecoItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="background" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {getItemsByType('background').map(item => (
                <DecoItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="effect" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {getItemsByType('effect').map(item => (
                <DecoItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="font-bold mb-2">✨ コインの獲得方法</h3>
              <div className="space-y-1 text-sm text-app-base-light">
                <p>• 温泉に入浴する (+10コイン)</p>
                <p>• スタンプラリー達成 (+20コイン)</p>
                <p>• レベルアップボーナス (+25コイン)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomTabNavigation 
        activeTab="settings" 
        onTabChange={handleTabChange}
      />
    </div>
  );
}