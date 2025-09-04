import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Sparkles } from 'lucide-react';
import kawaiiImage from 'figma:asset/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';

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

interface TimerScreenProps {
  character: Character;
  onComplete: (timeSpent: number) => void;
  onCancel: () => void;
}

export function TimerScreen({ character, onComplete, onCancel }: TimerScreenProps) {
  const [timeElapsed, setTimeElapsed] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [buttonText, setButtonText] = useState('入浴を始める！');
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 背景色を時間に応じて変化させる関数
  const getBackgroundColor = (seconds: number) => {
    const minutes = seconds / 60;
    if (minutes >= 30) {
      return '#f7a5a5'; // 30分以上はメインカラー固定
    }
    
    // 0分から30分まで線形補間
    const progress = minutes / 30; // 0〜1の値
    
    // ベースカラー (#5d688a) からメインカラー (#f7a5a5) への補間
    const baseR = 0x5d;
    const baseG = 0x68;
    const baseB = 0x8a;
    
    const targetR = 0xf7;
    const targetG = 0xa5;
    const targetB = 0xa5;
    
    const r = Math.round(baseR + (targetR - baseR) * progress);
    const g = Math.round(baseG + (targetG - baseG) * progress);
    const b = Math.round(baseB + (targetB - baseB) * progress);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleButtonClick = () => {
    if (!isRunning) {
      // タイマー開始
      setIsRunning(true);
      setButtonText('温泉からあがる');
    } else {
      // 確認モーダルを表示
      setShowExitModal(true);
    }
  };

  const handleExitConfirm = () => {
    // タイマー停止して完了画面へ
    setIsRunning(false);
    setShowExitModal(false);
    const timeSpentMinutes = Math.floor(timeElapsed / 60);
    onComplete(timeSpentMinutes);
  };

  const handleExitCancel = () => {
    // モーダルを閉じてタイマー継続
    setShowExitModal(false);
  };

  const currentBackgroundColor = getBackgroundColor(timeElapsed);

  return (
    <div 
      className="min-h-screen p-4 relative overflow-hidden transition-colors duration-1000" 
      style={{ backgroundColor: currentBackgroundColor }}
    >
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
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        .character-pulse {
          animation: characterPulse 10s ease-in-out infinite;
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

      <div className="max-w-md mx-auto flex flex-col justify-center min-h-screen relative z-10">
        
        {/* タイマー表示 */}
        <div className="text-center mb-8">
          <div className="text-8xl font-bold text-white mb-4 drop-shadow-lg">
            {formatTime(timeElapsed)}
          </div>
          <p className="text-lg text-white/90">
            {isRunning ? '入浴中...' : '温泉タイマー'}
          </p>
        </div>

        {/* キャラクター表示 */}
        <Card className="mb-8 bg-white/90 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-app-accent-2 rounded-full border-4 border-app-accent-1 flex items-center justify-center overflow-hidden relative">
                <img
                  src={kawaiiImage}
                  alt={character.name}
                  className="w-28 h-28 object-contain character-pulse absolute top-1/2 left-1/2"
                />
                {/* キャラクター周りのキラキラ */}
                <div className="absolute -top-2 -right-2 text-yellow-300 animate-bounce">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-2 -left-2 text-pink-300 animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-app-base mb-2">{character.name}</h2>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="text-app-base-light">レベル</p>
                  <p className="font-bold text-app-main">{character.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-app-base-light">温泉回数</p>
                  <p className="font-bold text-app-main">{character.onsenCount}</p>
                </div>
              </div>
              
              {isRunning && (
                <div className="mt-4 p-3 bg-white/95 rounded-lg shadow-md border border-white/20">
                  <p className="text-sm text-app-base">
                    {timeElapsed < 60 ? '温泉に入ったばかり...' :
                     timeElapsed < 300 ? 'だんだん温まってきた♪' :
                     timeElapsed < 600 ? 'とってもリラックス中♨️' :
                     timeElapsed < 1200 ? 'すっかり癒されてる〜😌' :
                     timeElapsed < 1800 ? '最高の温泉タイム！🥰' :
                     '極上のリラックス状態✨'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 入浴ボタン */}
        <Button 
          size="lg" 
          className="w-full mb-6 py-4 text-lg shadow-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>

        {/* キャンセルボタン */}
        <Button
          variant="outline"
          size="lg"
          className="w-full bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
          onClick={onCancel}
        >
          ホームに戻る
        </Button>

      </div>

      {/* 確認モーダル */}
      <Dialog open={showExitModal} onOpenChange={(open) => {
        // バツボタンでのクローズを無効化（まだはいるボタンでのみクローズ可能）
        if (!open && showExitModal) {
          return;
        }
        setShowExitModal(open);
      }}>
        <DialogContent className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm border-2 border-app-accent-1">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-app-accent-2 rounded-full border-4 border-app-accent-1 flex items-center justify-center">
              <img
                src={kawaiiImage}
                alt={character.name}
                className="w-12 h-12 object-contain"
              />
            </div>
            <DialogTitle className="text-xl text-app-base">温泉からあがりますか？</DialogTitle>
            <DialogDescription className="text-app-base-light mt-2">
              入浴時間：{formatTime(timeElapsed)}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col space-y-3 sm:flex-col sm:space-x-0 sm:space-y-3">
            <Button
              onClick={handleExitConfirm}
              className="w-full bg-app-main hover:bg-app-main-dark text-white shadow-lg"
              size="lg"
            >
              あがる！
            </Button>
            <Button
              onClick={handleExitCancel}
              variant="outline"
              className="w-full border-app-base text-app-base hover:bg-app-accent-2"
              size="lg"
            >
              まだはいる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}