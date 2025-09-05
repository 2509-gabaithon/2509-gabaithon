import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Navigation, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface OnsenStamp {
  id: number;
  name: string;
  location: string;
  image: string;
  visited: boolean;
  distance: number;
  difficulty: string;
}

interface LocationCheckScreenProps {
  onsen: OnsenStamp;
  onBack: () => void;
  onLocationConfirmed: () => void;
}

export function LocationCheckScreen({ onsen, onBack, onLocationConfirmed }: LocationCheckScreenProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'near' | 'far' | null>(null);
  const [distance, setDistance] = useState(0);

  const checkLocation = () => {
    setIsChecking(true);
    setLocationStatus('checking');
    
    // 位置情報チェックのシミュレーション
    setTimeout(() => {
      let simulatedDistance: number;
      
      // 箱根湯本温泉（id: 1）の場合は500m以内にいることをシミュレート
      if (onsen.id === 1) {
        simulatedDistance = Math.random() * 0.3 + 0.1; // 0.1-0.4km の範囲
        setDistance(simulatedDistance);
        setLocationStatus('near');
      } else {
        // 他の温泉の場合はランダムな距離
        simulatedDistance = Math.random() * 2; // 0-2km のランダム距離
        setDistance(simulatedDistance);
        
        if (simulatedDistance < 0.5) {
          setLocationStatus('near');
        } else {
          setLocationStatus('far');
        }
      }
      setIsChecking(false);
    }, 3000);
  };

  const getStatusIcon = () => {
    switch (locationStatus) {
      case 'checking':
        return <Navigation className="h-8 w-8 text-app-base animate-spin" />;
      case 'near':
        return <CheckCircle className="h-8 w-8 text-app-main" />;
      case 'far':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <MapPin className="h-8 w-8 text-app-base-light" />;
    }
  };

  const getStatusMessage = () => {
    switch (locationStatus) {
      case 'checking':
        return '現在地を確認しています...';
      case 'near':
        return `素晴らしい！${onsen.name}の近くにいます`;
      case 'far':
        return `${onsen.name}まで約${distance.toFixed(1)}km離れています`;
      default:
        return '位置情報を確認して温泉体験を始めましょう';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-accent-2 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-app-base">現在地チェック</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <ImageWithFallback
                src={onsen.image}
                alt={onsen.name}
                className="w-32 h-32 mx-auto rounded-lg object-cover mb-4"
              />
              <h2 className="text-xl font-bold mb-1">{onsen.name}</h2>
              <div className="flex items-center justify-center text-app-base-light mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {onsen.location}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">位置情報確認</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="mb-4">
                {getStatusIcon()}
              </div>
              <p className="text-lg font-medium mb-2">{getStatusMessage()}</p>
              
              {locationStatus === 'checking' && (
                <div className="mb-4">
                  <Progress value={66} className="h-2" />
                  <p className="text-sm text-app-base-light mt-2">GPS信号を受信中...</p>
                </div>
              )}
              
              {locationStatus === 'near' && (
                <Badge className="bg-app-main mb-4">
                  ✓ 位置確認完了
                </Badge>
              )}
              
              {locationStatus === 'far' && (
                <div className="mb-4">
                  <Badge variant="destructive" className="mb-2">
                    ⚠️ 温泉から離れています
                  </Badge>
                  <p className="text-sm text-app-base-light">
                    温泉の近く（500m以内）で再度お試しください
                  </p>
                </div>
              )}
            </div>

            {!locationStatus && (
              <Button 
                size="lg" 
                className="w-full"
                onClick={checkLocation}
              >
                現在地を確認する
              </Button>
            )}

            {locationStatus === 'checking' && (
              <Button 
                size="lg" 
                className="w-full" 
                disabled
              >
                確認中...
              </Button>
            )}

            {locationStatus === 'near' && (
              <Button 
                size="lg" 
                className="w-full"
                onClick={onLocationConfirmed}
              >
                温泉体験を開始する
              </Button>
            )}

            {locationStatus === 'far' && (
              <Button 
                variant="outline"
                size="lg" 
                className="w-full"
                onClick={checkLocation}
              >
                再確認する
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="font-bold mb-2">💡 ヒント</h3>
              <p className="text-sm text-app-base-light">
                温泉の受付や入口付近で位置確認を行うと、より正確に認識されます。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}