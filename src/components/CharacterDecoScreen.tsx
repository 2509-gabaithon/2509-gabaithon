import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CharacterWithAccessory } from './CharacterWithAccessory';
import { getUserAccessaries, equipAccessary, getEquippedAccessary, UserAccessary } from '@/utils/supabase/accessary';
import kawaiiImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';
import { ArrowLeft, Sparkles, Package, Loader2 } from 'lucide-react';
import { BottomTabNavigation, TabType } from './BottomTabNavigation';

interface CharacterDecoScreenProps {
  onBack: () => void;
  character: {
    name: string;
    type: string;
    level: number;
  };
  onTabChange?: (tab: TabType) => void;
}

export function CharacterDecoScreen({ onBack, character, onTabChange }: CharacterDecoScreenProps) {
  const [userAccessaries, setUserAccessaries] = useState<UserAccessary[]>([]);
  const [equippedAccessary, setEquippedAccessary] = useState<UserAccessary | null>(null);
  const [loading, setLoading] = useState(true);
  const [equipLoading, setEquipLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 所有アクセサリと装備状態を取得
  useEffect(() => {
    const fetchAccessaries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ownedAccessaries, equipped] = await Promise.all([
          getUserAccessaries(),
          getEquippedAccessary()
        ]);
        
        setUserAccessaries(ownedAccessaries);
        setEquippedAccessary(equipped);
      } catch (error) {
        console.error('アクセサリ取得エラー:', error);
        setError('アクセサリ情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessaries();
  }, []);

  // アクセサリの装備/装備解除
  const handleEquipAccessary = async (accessaryId: number) => {
    try {
      setEquipLoading(accessaryId);
      
      // 現在装備中のアクセサリと同じ場合は装備解除
      const isCurrentlyEquipped = equippedAccessary?.accessary_id === accessaryId;
      
      if (isCurrentlyEquipped) {
        await equipAccessary(null); // 装備解除
        setEquippedAccessary(null);
      } else {
        await equipAccessary(accessaryId); // 新しく装備
        // 装備状態を更新
        const newEquipped = userAccessaries.find(ua => ua.accessary_id === accessaryId) || null;
        setEquippedAccessary(newEquipped);
      }
      
      console.log('✅ 装備変更完了:', { accessaryId, isCurrentlyEquipped });
    } catch (error) {
      console.error('装備変更エラー:', error);
      setError('装備の変更に失敗しました');
    } finally {
      setEquipLoading(null);
    }
  };

  // レアリティに応じた色を取得
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-indigo-500';
      case 'common':
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  // アクセサリ画像のパスを取得
  const getAccessaryImagePath = (accessaryId: number): string => {
    return `/accessaries/${accessaryId}.png`;
  };

  const handleTabChange = (tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // アクセサリカードコンポーネント
  const AccessaryCard = ({ userAccessary }: { userAccessary: UserAccessary }) => {
    const isEquipped = equippedAccessary?.accessary_id === userAccessary.accessary_id;
    const isLoading = equipLoading === userAccessary.accessary_id;
    
    return (
      <Card className={`cursor-pointer transition-all bg-white/95 backdrop-blur-sm border-white/20 ${isEquipped ? 'ring-2 ring-app-main' : ''}`}>
        <CardContent className="p-4">
          <div className="text-center">
            {/* アクセサリ画像 */}
            <div className="w-16 h-16 mx-auto mb-3 relative">
              <img
                src={getAccessaryImagePath(userAccessary.accessary_id)}
                alt={userAccessary.accessary?.name || 'アクセサリ'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // 画像読み込み失敗時はデフォルト画像を表示
                  e.currentTarget.src = '/accessaries/0.png';
                }}
              />
              {/* 装備中インジケーター */}
              {isEquipped && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-app-main rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            <h4 className="font-bold mb-2 text-app-base text-sm">
              {userAccessary.accessary?.name || `アクセサリ #${userAccessary.accessary_id}`}
            </h4>
            
            <Button
              size="sm"
              variant={isEquipped ? "default" : "outline"}
              onClick={() => handleEquipAccessary(userAccessary.accessary_id)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : isEquipped ? (
                '装備解除'
              ) : (
                '装備する'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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
              <div className="mx-auto mb-4">
                <CharacterWithAccessory
                  character={character}
                  size="lg"
                  className="mx-auto"
                />
              </div>
              <h3 className="font-bold text-app-base">{character.name}</h3>
            </div>
          </CardContent>
        </Card>

        {/* エラー表示 */}
        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="pt-4">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* アクセサリ一覧 */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Package className="w-5 h-5 text-app-base mr-2" />
              <h3 className="font-bold text-app-base">所有アクセサリ</h3>
              <span className="ml-auto text-sm text-app-base-light">
                {userAccessaries.length}個
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-app-base" />
                <span className="ml-2 text-app-base">読み込み中...</span>
              </div>
            ) : userAccessaries.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {userAccessaries.map(userAccessary => (
                  <AccessaryCard key={userAccessary.accessary_id} userAccessary={userAccessary} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-app-base-light">アクセサリを持っていません</p>
                <p className="text-sm text-app-base-light mt-1">
                  クエストをクリアしてアクセサリを獲得しよう！
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <BottomTabNavigation 
        activeTab="none" 
        onTabChange={handleTabChange}
      />
    </div>
  );
}
