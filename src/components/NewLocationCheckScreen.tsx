import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';

import kawaiiImage from 'figma:asset/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';
import mapImage from 'figma:asset/1a0f3b4eaaf666c678218990a5f3915504e73d9c.png';

interface NewLocationCheckScreenProps {
  onBack: () => void;
  onStartBathing: () => void;
}

// 温泉の位置データ（箱根湯本温泉の座標）
const HAKONE_YUMOTO_LAT = 35.2322;
const HAKONE_YUMOTO_LNG = 139.1069;

// 現在地のシミュレーション（箱根湯本温泉から500m以内）
const SIMULATED_USER_LAT = 35.2318; // 少し南
const SIMULATED_USER_LNG = 139.1065; // 少し西

export function NewLocationCheckScreen({ onBack, onStartBathing }: NewLocationCheckScreenProps) {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isNearOnsen, setIsNearOnsen] = useState(false);
  const [distance, setDistance] = useState<number>(0);

  // 距離計算関数（ハバーサイン公式）
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // 地球の半径（メートル）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    // 現在地を取得（シミュレーション）
    setUserLocation({
      lat: SIMULATED_USER_LAT,
      lng: SIMULATED_USER_LNG
    });

    // 箱根湯本温泉からの距離を計算
    const dist = calculateDistance(
      SIMULATED_USER_LAT,
      SIMULATED_USER_LNG,
      HAKONE_YUMOTO_LAT,
      HAKONE_YUMOTO_LNG
    );
    
    setDistance(Math.round(dist));
    setIsNearOnsen(dist <= 500); // 500m以内なら温泉の近く
  }, []);



  return (
    <div className="h-screen relative overflow-hidden">
      {/* マップエリア - 画面全体 */}
      <div className="absolute inset-0">
        {/* 地図画像背景 */}
        <img 
          src={mapImage} 
          alt="箱根エリア地図" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* 地図の上にオーバーレイ */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* 温泉の位置 - 箱根湯本温泉の実際の位置付近 */}
        <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-8 bg-app-main rounded-full border-3 border-white shadow-xl flex items-center justify-center">
              <span className="text-sm">♨️</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md">
                <span className="text-xs font-bold text-app-base">箱根湯本温泉</span>
              </div>
            </div>
          </div>
        </div>

        {/* 現在地（もちもちうさぎ） - 温泉の近くに配置 */}
        {userLocation && (
          <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 translate-x-12 translate-y-6">
            <div className="relative">
              {/* 位置の円 */}
              <div className="w-14 h-14 bg-app-accent-2 rounded-full border-3 border-white shadow-xl flex items-center justify-center relative overflow-hidden">
                <img
                  src={kawaiiImage}
                  alt="もちもちうさぎ"
                  className="w-11 h-11 object-contain"
                />
              </div>
              
              {/* 現在地のラベル */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md">
                  <span className="text-xs font-bold text-app-main">現在地</span>
                </div>
              </div>

              {/* 近い場合の円 */}
              {isNearOnsen && (
                <div className="absolute inset-0 w-14 h-14 border-3 border-app-main rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        )}

        {/* 距離表示の線 */}
        {isNearOnsen && (
          <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 border-2 border-dashed border-app-main/60 rounded-full opacity-70"></div>
          </div>
        )}
      </div>
      
      {/* ヘッダー - オーバーレイ */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center p-4 bg-white/80 backdrop-blur-sm">
        <Button variant="ghost" onClick={onBack} className="mr-2 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-app-base">現在地チェック</h1>
      </div>

      {/* 位置情報カード - オーバーレイ */}
      <Card className="absolute top-20 left-4 right-4 z-10">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Navigation className="h-5 w-5 text-app-main mr-2" />
              <div>
                <p className="font-medium">箱根湯本温泉</p>
                <p className="text-sm text-app-base-light">
                  距離: {distance}m
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isNearOnsen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {isNearOnsen ? '範囲内' : '範囲外'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 説明カード - オーバーレイ */}
      <Card className="absolute bottom-4 left-4 right-4 z-10">
        <CardContent className="pt-4">
          <div className="text-center">
            <h3 className="font-bold mb-2">📍 位置確認</h3>
            <div className="space-y-1 text-sm text-app-base-light">
              <p>• 温泉から50m以内で入浴可能</p>
              <p>• {isNearOnsen ? 'もちもちうさぎが温泉を見つけました！' : 'もう少し温泉に近づいてください'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 入浴ボタン - オーバーレイ */}
      <div className="absolute bottom-38 left-4 right-4 z-20">
        <Button
          size="lg"
          className="w-full"
          onClick={onStartBathing}
          disabled={!isNearOnsen}
        >
          {isNearOnsen ? '入浴する！' : '温泉の近くではありません'}
        </Button>
      </div>
    </div>
  );
}