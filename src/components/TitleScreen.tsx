import React from 'react';

import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, Settings } from 'lucide-react';
import characterImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';
import logoImage from '@/assets/083e8d1afec77cec07a99daa65bb32f7c070dfa4.png';

interface TitleScreenProps {
  onStart: () => void;
  onSettings: () => void;
}

export function TitleScreen({ onStart, onSettings }: TitleScreenProps) {
  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main relative overflow-hidden cursor-pointer"
      onClick={onStart}
    >
      {/* デバッグ用設定ボタン */}
      <div 
        className="absolute top-8 right-8 z-20 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSettings();
        }}
      >
        <Settings className="w-6 h-6 text-white" />
      </div>
      
      {/* Steam animation styles */}
      <style jsx>{`
        @keyframes steam1 {
          0% {
            opacity: 0.7;
            transform: translateY(0px) translateX(0px) scale(0.5);
          }
          50% {
            opacity: 0.4;
            transform: translateY(-100px) translateX(10px) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) translateX(-5px) scale(1);
          }
        }
        
        @keyframes steam2 {
          0% {
            opacity: 0.6;
            transform: translateY(0px) translateX(0px) scale(0.4);
          }
          50% {
            opacity: 0.3;
            transform: translateY(-80px) translateX(-15px) scale(0.7);
          }
          100% {
            opacity: 0;
            transform: translateY(-160px) translateX(10px) scale(1);
          }
        }
        
        @keyframes steam3 {
          0% {
            opacity: 0.8;
            transform: translateY(0px) translateX(0px) scale(0.6);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-120px) translateX(5px) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translateY(-240px) translateX(-10px) scale(1.2);
          }
        }
        
        .steam1 {
          animation: steam1 3s ease-out infinite;
        }
        
        .steam2 {
          animation: steam2 2.5s ease-out infinite 0.5s;
        }
        
        .steam3 {
          animation: steam3 3.5s ease-out infinite 1s;
        }
        
        .steam4 {
          animation: steam1 2.8s ease-out infinite 1.5s;
        }
        
        .steam5 {
          animation: steam2 3.2s ease-out infinite 2s;
        }
        
        .steam6 {
          animation: steam3 2.7s ease-out infinite 0.8s;
        }
        
        @keyframes characterPulse {
          0% {
            transform: translateX(-50%) translateY(-50%) scale(1);
          }
          50% {
            transform: translateX(-50%) translateY(-50%) scale(1.05);
          }
          100% {
            transform: translateX(-50%) translateY(-50%) scale(1);
          }
        }
        
        .character-pulse {
          animation: characterPulse 10s ease-in-out infinite;
        }
        
        @keyframes textBlink {
          0% {
            opacity: 0;
          }
          33.33% {
            opacity: 1;
          }
          66.66% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        .text-blink {
          animation: textBlink 1.5s ease-in-out infinite;
        }
      `}</style>
      {/* Background stars/sparkles */}
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

      {/* Steam animation around character */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Steam from character area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="steam1 w-8 h-12 bg-white/70 rounded-full blur-sm absolute -top-6 -left-16"></div>
          <div className="steam2 w-6 h-10 bg-white/60 rounded-full blur-sm absolute -top-4 right-12"></div>
          <div className="steam3 w-10 h-16 bg-white/80 rounded-full blur-sm absolute -top-8 left-8"></div>
          <div className="steam4 w-7 h-11 bg-white/65 rounded-full blur-sm absolute -top-5 -right-8"></div>
        </div>
        
        {/* Steam from bottom corners */}
        <div className="absolute bottom-20 left-8">
          <div className="steam5 w-12 h-18 bg-white/60 rounded-full blur-md"></div>
        </div>
        <div className="absolute bottom-16 right-12">
          <div className="steam6 w-10 h-15 bg-white/55 rounded-full blur-md"></div>
        </div>
        <div className="absolute bottom-24 left-1/3">
          <div className="steam1 w-8 h-14 bg-white/50 rounded-full blur-md"></div>
        </div>
        <div className="absolute bottom-18 right-1/4">
          <div className="steam2 w-9 h-13 bg-white/58 rounded-full blur-md"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* Title logo area */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <img
              src={logoImage.src}
              alt="温泉スタンプラリー"
              className="w-64 h-auto mx-auto drop-shadow-lg"
            />
            <div className="absolute -top-2 -right-4">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main character */}
        <div className="relative mb-12 w-full">
          <div className="w-full h-48 bg-white/10 shadow-2xl relative overflow-visible">
            <img
              src={characterImage.src}
              alt="温泉キャラクター"
              className="w-64 h-64 object-contain absolute top-1/2 left-1/2 character-pulse"
            />
          </div>
          
          {/* Floating elements around character */}
          <div className="absolute -top-8 left-4 text-yellow-300 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-8 right-4 text-pink-300 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Sparkles className="w-6 h-6" />
          </div>
        </div>



        {/* Touch to start area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/50 py-9">
          <div className="text-center">
            <p className="text-app-base text-lg font-bold text-blink">♨温泉の旅を始める♨</p>
          </div>
        </div>
      </div>
    </div>
  );
}