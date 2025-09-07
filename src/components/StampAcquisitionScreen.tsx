import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import noiseTexture from "@/assets/221bcc06007de28e2dedf86e88d0a2798eac78e7.png";

interface StampAcquisitionScreenProps {
  onComplete: () => void;
  acquiredStamp: { name: string; icon: string };
}

export function StampAcquisitionScreen({
  onComplete,
  acquiredStamp,
}: StampAcquisitionScreenProps) {
  const [stampAnimationComplete, setStampAnimationComplete] = useState(false);
  const [showTapMessage, setShowTapMessage] = useState(false);
  const [canInteract, setCanInteract] = useState(false);

  useEffect(() => {
    // スタンプアニメーション完了後、1秒待ってから「タップして次へ」を表示
    if (stampAnimationComplete) {
      const timer = setTimeout(() => {
        setShowTapMessage(true);
        setCanInteract(true);
      }, 1000); // スタンプアニメーション完了後1秒

      return () => clearTimeout(timer);
    }
  }, [stampAnimationComplete]);

  const handleScreenTap = () => {
    if (canInteract) {
      onComplete();
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
      onClick={handleScreenTap}
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-8 h-8 bg-app-main rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-32 right-16 w-6 h-6 bg-app-base rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-app-main-light rounded-full blur-sm animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-12 w-10 h-10 bg-app-accent-1-dark rounded-full blur-sm animate-pulse delay-1500"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-col items-center justify-center flex-1 z-10">
        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl text-center text-app-base">クエスト完了！</h1>
        </motion.div>

        {/* スタンプアニメーション */}
        <div className="relative">
          <motion.div
            initial={{ scale: 50, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1,
              ease: "easeIn",
            }}
            className="relative"
            onAnimationComplete={() => setStampAnimationComplete(true)}
          >
            {/* スタンプ画像 */}
            <div className="relative">
              <img
                src={acquiredStamp.icon}
                alt={acquiredStamp.name}
                className="w-48 h-48 object-contain relative z-10"
                style={{
                  filter: `
                    contrast(1.2) 
                    brightness(0.9)
                    sepia(0.1)
                  `,
                }}
              />

              {/* 白いノイズテクスチャオーバーレイ */}
              <div
                className="absolute inset-0 w-48 h-48 opacity-25 pointer-events-none z-20"
                style={{
                  backgroundImage: `url(${noiseTexture.src})`,
                  backgroundSize: "200px 200px",
                  backgroundRepeat: "repeat",
                  mixBlendMode: "screen",
                  mask: `url(${acquiredStamp.icon})`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMask: `url(${acquiredStamp.icon})`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* タップして次へメッセージ */}
        {showTapMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <p className="text-app-base animate-pulse">タップして次へ</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
