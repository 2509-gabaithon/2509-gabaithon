import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft } from 'lucide-react';
import kawaiiImage from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png';

interface CharacterSelectScreenProps {
  userName: string;
  characterName?: string;
  onBack: () => void;
  onCharacterNameChange: (name: string) => void;
  onComplete: () => void;
}

const defaultCharacter = {
  id: 'sakura-san',
  defaultName: 'もちもちうさぎ',
  description: 'あなたの温泉パートナー',
  image: kawaiiImage
};

export function CharacterSelectScreen({ userName, characterName = '', onBack, onCharacterNameChange, onComplete }: CharacterSelectScreenProps) {
  const [inputName, setInputName] = useState(characterName || defaultCharacter.defaultName);

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
        <Button variant="ghost" size="icon" onClick={onBack} className="bg-white/20 hover:bg-white/30">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Main content - centered */}
      <div className="min-h-screen flex items-center justify-center p-6 pt-16">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">パートナーに名前をつけよう</h1>
            <p className="text-white/80">{userName}さんのパートナーです</p>
          </div>

          {/* Character Display */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full mb-4 overflow-hidden bg-app-accent-2 flex items-center justify-center shadow-lg">
                  <img
                    src={defaultCharacter.image.src}
                    alt="パートナーキャラクター"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <p className="text-app-base-light mb-4">{defaultCharacter.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Name Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>パートナーの名前</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="characterName">名前を入力してください</Label>
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