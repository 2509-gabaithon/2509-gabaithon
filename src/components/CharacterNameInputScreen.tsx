import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { ArrowLeft } from "lucide-react";
import kawaiiImage from "@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png";
import { StaticImageData } from "next/image";

interface CharacterNameInputScreenProps {
  userName: string;
  character?: {
    id: string;
    name: string;
    description: string;
    image: StaticImageData;
  };
  onBack: () => void;
  onCharacterNameChange: (name: string) => void;
  onComplete: () => void;
}

const defaultCharacter = {
  id: "sakura-san",
  name: "もちもちうさぎ",
  description: "あなたの温泉パートナー",
  image: kawaiiImage,
};

export function CharacterNameInputScreen({
  userName, //現状使われていないが、バックの処理で必要になる可能性があるためpropsとして受け取る
  character = defaultCharacter,
  onBack,
  onCharacterNameChange,
  onComplete,
}: CharacterNameInputScreenProps) {
  const initialName = character.name || defaultCharacter.name;
  const [inputName, setInputName] = useState(initialName);
  
  // 初期化フラグを使用して一度だけ親の状態を更新
  const isInitializedRef = useRef(false);
  
  if (!isInitializedRef.current) {
    onCharacterNameChange(initialName);
    isInitializedRef.current = true;
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setInputName(newName);
    onCharacterNameChange(newName);
  };

  const handleComplete = () => {
    if (inputName.trim()) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main relative">
      {/* Back button - fixed to top left */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Main content - centered */}
      <div className="min-h-screen flex items-center justify-center p-6 pt-16">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              この子の名前は？
            </h1>
          </div>

          {/* Character Display */}
          <div className="flex flex-col items-center text-center">
            <img
              src={character.image.src}
              alt="パートナーキャラクター"
              className="size-76 object-contain shadow-[0px_7px_7px_-10px_rgba(0,0,0,0.5)] mb-6"
            />
            {/* 説明テキストだけ白枠で囲む */}
            <p className="text-xl font-bold text-white mb-12 opacity-90">
              {character.description || "ここにパートナーの説明が入る"}
            </p>
          </div>

          {/* Name Input */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Input
                  id="characterName"
                  type="text"
                  value={inputName}
                  onChange={handleNameChange}
                  placeholder="もちもちうさぎ"
                  className="text-center"
                  maxLength={20}
                />
                <p className="text-xs text-app-base-light text-center">
                  {inputName.length}/20文字
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={handleComplete}
            disabled={!inputName.trim()}
          >
            設定完了
          </Button>
        </div>
      </div>
    </div>
  );
}
