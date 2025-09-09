import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";

import beppyonImage from "@/assets/3c6e9e82c814a4dcb5208e61977d5118a50e6a2c.png";
import yuttsuraImage from "@/assets/cc82c1498637df3406caa6867e011e9f0b8813d7.png";
import kawaiiImage from "@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png";
import { GoogleMap, Marker, Circle, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

interface OnsenDetail {
  name: string;
  place_id: string;
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
}

interface NewLocationCheckScreenProps {
  onBack: () => void;
  onStartBathing: () => void;  
  setOnsen: (name: string) => void;
  setOnsenDetail: (onsen: OnsenDetail | null) => void;
  character: { name: string; type: string };
}

// 距離計算関数（ハバーサイン公式）
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371000; // 地球の半径（メートル）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
const GOOGLE_MAP_LIBRARIES = ['places'];

// 温泉の範囲
const MAX_ONSEN_DISTANCE = 150;

export function NewLocationCheckScreen({
  onBack,
  onStartBathing,
  setOnsen,
  setOnsenDetail,
  character,
}: NewLocationCheckScreenProps) {
  const containerStyle = {
    width: '100%',
    height: '100%',
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
      libraries: GOOGLE_MAP_LIBRARIES as any,
  });
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [onsenLocations, setOnsenLocations] = useState<any[]>([]);
  const [activeOnsenIdx, setActiveOnsenIdx] = useState<number | null>(null);
  const [isNearOnsen, setIsNearOnsen] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<boolean>(false);

  const getLocation = () => {
    setLocationError(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(false);
        },
        () => {
          setLocationError(true);
        }
      );
    } else {
      setLocationError(true);
    }
  };
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

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoaded || !currentPosition) return;
    const map = new window.google.maps.Map(document.createElement('div'));
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: currentPosition,
      radius: 5000, // 5km以内
      keyword: '温泉',
      // type: 'spa',
    };
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setOnsenLocations(results);
        // 最も近い温泉までの距離を計算
        let minDist = Infinity;
        results.forEach((place: any) => {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const dist = calculateDistance(currentPosition.lat, currentPosition.lng, lat, lng);
          if (dist < minDist) minDist = dist;
        });
        setIsNearOnsen(minDist <= MAX_ONSEN_DISTANCE);
      } else {
        setIsNearOnsen(false);
      }
    });
  }, [isLoaded, currentPosition]);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Google Mapエリア */}
      <div className="absolute inset-0">
        {locationError ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-4 text-red-600 font-bold">現在地を取得できませんでした</div>
            <Button onClick={getLocation} variant="outline">再取得する</Button>
          </div>
        ) : isLoaded ? (
          currentPosition ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentPosition}
              zoom={18}
            >
              {/* ...existing code... */}
              <Marker
                position={currentPosition}
                icon={{
                  url: getCharacterImage().src,//ここで画像を変更
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
              <Circle
                center={currentPosition}
                radius={MAX_ONSEN_DISTANCE}
                options={{
                  strokeColor: '#4285F4',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#4285F4',
                  fillOpacity: 0.2,
                }}
              />
              {onsenLocations.map((place, idx) => (
                <React.Fragment key={idx}>
                  <Marker
                    position={{
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    }}
                    icon={{
                      url: '/spa.png',
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                    onClick={() => {
                      setActiveOnsenIdx(idx);
                      setOnsen(onsenLocations[idx].name);
                      setOnsenDetail({
                        name: onsenLocations[idx].name,
                        place_id: onsenLocations[idx].place_id,
                        geometry: onsenLocations[idx].geometry
                      });
                    }}
                  />
                  {activeOnsenIdx === idx && (
                    <InfoWindow
                      position={{
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                      }}
                      onCloseClick={() => {
                        setActiveOnsenIdx(null);
                        setOnsen('未選択');
                        setOnsenDetail(null);
                      }}
                    >
                      <div>{place.name}</div>
                    </InfoWindow>
                  )}
                </React.Fragment>
              ))}
            </GoogleMap>
          ) : (
            <div>現在地を取得中...</div>
          )
        ) : (
          <div>Loading...</div>
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
                <p className="font-medium">
                  {activeOnsenIdx !== null && onsenLocations[activeOnsenIdx].name
                    ? onsenLocations[activeOnsenIdx].name
                    : '[未選択]'}
                </p>
                <p className="text-sm text-app-base-light">
                  距離: {
                    activeOnsenIdx !== null && onsenLocations[activeOnsenIdx]
                      ? Math.round(
                          calculateDistance(
                            currentPosition?.lat ?? 0,
                            currentPosition?.lng ?? 0,
                            onsenLocations[activeOnsenIdx].geometry.location.lat(),
                            onsenLocations[activeOnsenIdx].geometry.location.lng()
                          )
                        )
                      : 0
                  }m
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${isNearOnsen
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
                }`}
            >
              {isNearOnsen ? "範囲内" : "範囲外"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 説明カード - オーバーレイ */}
      <Card className="absolute bottom-4 left-4 right-4 z-10">
        <CardContent className="pt-4">
          <div className="text-center">
            <h3 className="font-bold mb-2 flex justify-center items-center">
              <MapPin className="mr-2 text-[#F8447E]" /> 位置確認
            </h3>
            <div className="space-y-1 text-sm text-app-base-light">
              <p>• 温泉から{MAX_ONSEN_DISTANCE}m以内で入浴可能</p>
              <p>
                •{" "}
                {activeOnsenIdx !== null && onsenLocations[activeOnsenIdx]
                  ? `選択中: ${onsenLocations[activeOnsenIdx].name}`
                  : isNearOnsen
                    ? `${character.name}が温泉を見つけました！`
                    : "もう少し温泉に近づいてください"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 入浴ボタン - オーバーレイ */}
      <div className="absolute bottom-38 left-4 right-4 z-20">
        {activeOnsenIdx !== null && onsenLocations[activeOnsenIdx] ? (
          (() => {
            const selectedOnsen = onsenLocations[activeOnsenIdx];
            const distance = calculateDistance(
              currentPosition?.lat ?? 0,
              currentPosition?.lng ?? 0,
              selectedOnsen.geometry.location.lat(),
              selectedOnsen.geometry.location.lng()
            );
            const canBath = distance <= MAX_ONSEN_DISTANCE;
            return (
              <Button
                size="lg"
                className="w-full"
                onClick={onStartBathing}
                disabled={!canBath}
              >
                {canBath ? "入浴する！" : "温泉の近くではありません"}
              </Button>
            );
          })()
        ) : (
          <Button size="lg" className="w-full" disabled>
            温泉が選択されていません
          </Button>
        )}
      </div>
    </div>
  );
}
