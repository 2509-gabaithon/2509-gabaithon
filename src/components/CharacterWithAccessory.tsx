import React, { useState, useEffect } from 'react';
import { getEquippedAccessary, UserAccessary } from '@/utils/supabase/accessary';
import kawaiiImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';
import beppyonImage from '@/assets/ac98676411915df3391ad15ed92a3dbb57c0f66a.png';
import yuttsuraImage from '@/assets/221bcc06007de28e2dedf86e88d0a2798eac78e7.png';

interface CharacterWithAccessoryProps {
  character: {
    name: string;
    type: string;
    level?: number;
  };
  className?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface CharacterImageConfig {
  width: string;
  height: string;
}

const sizeConfig: Record<string, CharacterImageConfig> = {
  sm: { width: 'w-16', height: 'h-16' },
  md: { width: 'w-24', height: 'h-24' },
  lg: { width: 'w-32', height: 'h-32' },
  xl: { width: 'w-40', height: 'h-40' }
};

export function CharacterWithAccessory({ 
  character, 
  className = '', 
  alt,
  size = 'lg' 
}: CharacterWithAccessoryProps) {
  const [equippedAccessary, setEquippedAccessary] = useState<UserAccessary | null>(null);
  const [accessaryImageError, setAccessaryImageError] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // アクセサリ画像のパスを取得
  const getAccessaryImagePath = (accessaryId: number): string => {
    return `/accessaries/${accessaryId}.png`;
  };

  // デフォルト画像のパス
  const getDefaultAccessaryImagePath = (): string => {
    return '/accessaries/0.png';
  };

  // 装備中のアクセサリを取得
  useEffect(() => {
    const fetchEquippedAccessary = async () => {
      try {
        setLoading(true);
        const equipped = await getEquippedAccessary();
        setEquippedAccessary(equipped);
        setAccessaryImageError(false);
      } catch (error) {
        console.warn('装備中アクセサリ取得失敗:', error);
        setEquippedAccessary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEquippedAccessary();
  }, []);

  const sizeClass = sizeConfig[size];
  const characterImage = getCharacterImage();

  const handleAccessaryImageError = () => {
    setAccessaryImageError(true);
  };

  return (
    <div className={`relative ${sizeClass.width} ${sizeClass.height} ${className}`}>
      {/* ベースキャラクター画像 */}
      <img
        src={characterImage.src}
        alt={alt || character.name}
        className={`${sizeClass.width} ${sizeClass.height} object-contain`}
      />
      
      {/* アクセサリ画像（装備中の場合のみ表示） */}
      {!loading && equippedAccessary && (
        <img
          src={
            accessaryImageError 
              ? getDefaultAccessaryImagePath() 
              : getAccessaryImagePath(equippedAccessary.accessary_id)
          }
          alt={`アクセサリ: ${equippedAccessary.accessary?.name || '不明'}`}
          className={`absolute inset-0 ${sizeClass.width} ${sizeClass.height} object-contain pointer-events-none`}
          onError={handleAccessaryImageError}
          style={{
            zIndex: 10,
          }}
        />
      )}
      
      {/* ローディング表示（オプション） */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full">
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

// レガシー関数との互換性のためのラッパー
export function getCharacterImageWithAccessory(character: { type: string }) {
  // 注意: この関数は同期的に画像を返すため、アクセサリは含まれません
  // 新しいコンポーネント CharacterWithAccessory を使用してください
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
}
