import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Sparkles } from 'lucide-react';
import kawaiiImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';
import backgroundImage from '@/assets/ac98676411915df3391ad15ed92a3dbb57c0f66a.png';

interface Character {
  name: string;
  type: string;
  level: number;
  exp: number;
  maxExp: number;
  happiness: number;
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
  const [timeStart, setTimeStart] = useState(new Date())

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        const diffMilliseconds = Date.now() - timeStart.getTime()
        const diffSeconds = Math.floor(diffMilliseconds / 1000)
        setTimeElapsed(diffSeconds);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // タイマー数字の色を時間に応じて変化させる関数
  const getTimerTextColor = (seconds: number) => {
    const minutes = seconds / 60;
    if (minutes >= 30) {
      return '#f7a5a5'; // 30分以上はメインカラー固定
    }
    
    // 0分から30分まで線形補間
    const progress = minutes / 30; // 0〜1の値
    
    // 白色 (#ffffff) からメインカラー (#f7a5a5) への補間
    const baseR = 0xff;
    const baseG = 0xff;
    const baseB = 0xff;
    
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
      setTimeStart(new Date())
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

  const currentTimerColor = getTimerTextColor(timeElapsed);

  return (
    <div 
      className="min-h-screen p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
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
        <div className="absolute top-20 left-10 text-app-accent-1/80 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute top-32 right-16 text-app-accent-1/60 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute top-48 left-20 text-app-accent-1/70 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute bottom-32 right-10 text-app-accent-1/80 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-48 left-14 text-app-accent-1/60 animate-pulse">
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

      <div className="max-w-md mx-auto flex flex-col min-h-screen relative z-10">
        
        {/* タイマー表示 - 上の方に配置 */}
        <div className="text-center mt-24 mb-auto">
          <div 
            className="text-8xl font-bold mb-4 drop-shadow-lg"
            style={{ color: currentTimerColor }}
          >
            {formatTime(timeElapsed)}
          </div>
          <p className="text-lg text-white">
            {isRunning ? '入浴中...' : '温泉タイマー'}
          </p>
        </div>

        {/* ボタン群 - 下の方に配置 */}
        <div className="mt-auto mb-12">
          {/* 入浴ボタン */}
          <Button 
            size="lg" 
            className="w-full mb-6 py-4 text-lg shadow-lg bg-app-main hover:bg-app-main-dark text-white border-app-main"
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

      </div>

      {/* 確認モーダル */}
      <Dialog open={showExitModal} onOpenChange={(open) => setShowExitModal(open)} // 背景クリックでも閉じる
      >
        
        <DialogContent showCloseButton={false} className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm border-2 border-app-accent-1">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-app-accent-2 rounded-full border-4 border-app-accent-1 flex items-center justify-center">
              <img
                src={kawaiiImage.src}
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
