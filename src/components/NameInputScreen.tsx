import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

interface NameInputScreenProps {
  onNext: (name: string) => void;
  initialName?: string;
}

export function NameInputScreen({ onNext, initialName = '' }: NameInputScreenProps) {
  const [name, setName] = useState(initialName);

  const handleNext = () => {
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">あなたの名前は？</h1>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 温泉太郎"
              className="text-center"
            />
            <p className="text-sm text-app-base mt-4 text-center">あとで変更できます</p>
          </CardContent>
        </Card>

        <Button 
          size="lg" 
          className="w-full"
          onClick={handleNext}
          disabled={!name.trim()}
        >
          次へ
        </Button>
      </div>
    </div>
  );
}