import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface InitialSetupScreenProps {
  onComplete: (userData: { name: string; characterType: string }) => void;
}

const characterTypes = [
  { id: 'onsen-chan', name: '温泉ちゃん', description: '温泉大好きな癒し系' },
  { id: 'yuzu-kun', name: 'ゆずくん', description: '元気いっぱいの冒険家' },
  { id: 'sakura-san', name: 'さくらさん', description: '和の心を大切にする' }
];

export function InitialSetupScreen({ onComplete }: InitialSetupScreenProps) {
  const [name, setName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');

  const handleComplete = () => {
    if (name.trim() && selectedCharacter) {
      onComplete({ name: name.trim(), characterType: selectedCharacter });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-accent-1-light to-white p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-app-base mb-2">初期設定</h1>
          <p className="text-app-base-light">あなたの情報を教えてください</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>お名前を入力してください</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="name">ニックネーム</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 温泉太郎"
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>パートナーキャラクターを選んでください</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {characterTypes.map((character) => (
              <div
                key={character.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCharacter === character.id
                    ? 'border-app-main bg-app-accent-2'
                    : 'border-gray-200 hover:border-app-main-light'
                }`}
                onClick={() => setSelectedCharacter(character.id)}
              >
                <div className="flex items-center">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1700913015629-fa6d95da9d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2FydG9vbiUyMGNoYXJhY3RlciUyMG1hc2NvdHxlbnwxfHx8fDE3NTY4Mjc3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt={character.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{character.name}</h3>
                    <p className="text-sm text-app-base-light">{character.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button 
          size="lg" 
          className="w-full"
          onClick={handleComplete}
          disabled={!name.trim() || !selectedCharacter}
        >
          設定完了
        </Button>
      </div>
    </div>
  );
}