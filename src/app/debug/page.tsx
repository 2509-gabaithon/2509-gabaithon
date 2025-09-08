'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
const containerStyle = {
    width: '100%',
    height: '500px',
};

const LIBRARIES = ['places'];

export default function DebugMapPage() {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyB4ga7iefRwjh72nTR_8yt_wpnVNj76JzU', // ←APIキーを記入
        libraries: LIBRARIES,
    });
    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [onsenLocations, setOnsenLocations] = useState<any[]>([]);
    const [activeOnsenIdx, setActiveOnsenIdx] = useState<number | null>(null);

    // 現在地取得
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => {
                    alert('現在地を取得できませんでした');
                }
            );
        }
    }, []);

    // Nearby Searchで温泉を検索
    useEffect(() => {
        if (!isLoaded || !currentPosition) return;

        const map = new window.google.maps.Map(document.createElement('div'));
        const service = new window.google.maps.places.PlacesService(map);

        const request = {
            location: currentPosition,
            radius: 5000, // 5km以内
            // keyword: '温泉',
            types: 'spa',
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                setOnsenLocations(results);
            }
        });
    }, [isLoaded, currentPosition]);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div>
            <h2>近くの温泉マップ（デバッグ）</h2>
            {currentPosition && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={currentPosition}
                    zoom={13}
                >
                    {/* 現在地（カスタムアイコン） */}
                    <Marker
                        position={currentPosition}
                        icon={{
                            url: '/myplace.png', // publicフォルダに画像を配置
                            scaledSize: new window.google.maps.Size(40, 40),
                        }}
                    />
                    {/* 現在地から半径50mの円 */}
                    <Circle
                        center={currentPosition}
                        radius={50}
                        options={{
                            strokeColor: '#4285F4',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#4285F4',
                            fillOpacity: 0.2,
                        }}
                    />
                    {/* 温泉 */}
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
                                    onClick={() => setActiveOnsenIdx(idx)}
                                />
                                {activeOnsenIdx === idx && (
                                    <InfoWindow
                                        position={{
                                            lat: place.geometry.location.lat(),
                                            lng: place.geometry.location.lng(),
                                        }}
                                        onCloseClick={() => setActiveOnsenIdx(null)}
                                    >
                                            <div style={{ pointerEvents: 'none' }}>{place.name}</div>
                                    </InfoWindow>
                                )}
                            </React.Fragment>
                    ))}
                </GoogleMap>
            )}
            {!currentPosition && <div>現在地を取得中...</div>}
        </div>
    );
}