import React, { useState, useEffect } from 'react';
import { TitleScreen } from '../components/TitleScreen';
import { NameInputScreen } from '../components/NameInputScreen';
import { CharacterNameInputScreen } from '../components/CharacterNameInputScreen';
import { HomeScreen } from '../components/HomeScreen';
import { StampRallyScreen } from '../components/StampRallyScreen';
import { CharacterDecoScreen } from '../components/CharacterDecoScreen';
import { LocationCheckScreen } from '../components/LocationCheckScreen';
import { NewLocationCheckScreen } from '../components/NewLocationCheckScreen';

import { TimerScreen } from '../components/TimerScreen';
import { StampAcquisitionScreen } from '../components/StampAcquisitionScreen';
import { ResultScreen } from '../components/ResultScreen';
import { TabType } from '../components/BottomTabNavigation';

type ScreenType = 
  | 'title'
  | 'nameInput'
  | 'characterSelect'
  | 'home'
  | 'stampRally'
  | 'decoration'
  | 'locationCheck'
  | 'newLocationCheck'
  | 'timer'
  | 'stampAcquisition'
  | 'result';

interface UserData {
  name: string;
  characterType: string;
  isFirstTime: boolean;
}

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

interface OnsenStamp {
  id: number;
  name: string;
  location: string;
  image: string;
  visited: boolean;
  distance: number;
  difficulty: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('title');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [tempUserName, setTempUserName] = useState<string>('');
  const [characterName, setCharacterName] = useState<string>('もちもちうさぎ');
  const [selectedOnsen, setSelectedOnsen] = useState<OnsenStamp | null>(null);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [acquiredStamp, setAcquiredStamp] = useState<{ name: string; icon: string } | null>(null);

  // 初期化
  useEffect(() => {
    // ローカルストレージから既存データを確認（実際の実装では）
    const savedUser = localStorage.getItem('onsenAppUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData(user);
      // キャラクターデータも復元
      const savedCharacter = localStorage.getItem('onsenAppCharacter');
      if (savedCharacter) {
        setCharacter(JSON.parse(savedCharacter));
      }
    }
  }, []);

  const handleStart = () => {
    if (userData) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('nameInput');
    }
  };

  const handleDebugSettings = () => {
    setCurrentScreen('nameInput');
  };

  const handleNameInput = (name: string) => {
    setTempUserName(name);
    setCurrentScreen('characterSelect');
  };

  const handleCharacterNameChange = (name: string) => {
    setCharacterName(name);
  };

  const handleCharacterSelect = () => {
    if (!characterName.trim()) return;
    
    const newUserData: UserData = {
      name: tempUserName,
      characterType: 'sakura-san',
      isFirstTime: true
    };
    
    const newCharacter: Character = {
      name: characterName.trim(),
      type: 'sakura-san',
      level: 1,
      exp: 0,
      maxExp: 100,
      happiness: 80,
      stamina: 100,
      onsenCount: 0
    };

    setUserData(newUserData);
    setCharacter(newCharacter);
    
    // ローカルストレージに保存
    localStorage.setItem('onsenAppUser', JSON.stringify(newUserData));
    localStorage.setItem('onsenAppCharacter', JSON.stringify(newCharacter));
    
    setCurrentScreen('home');
  };



  const handleOnsenSelect = (onsen: OnsenStamp) => {
    setSelectedOnsen(onsen);
    setCurrentScreen('locationCheck');
  };

  const handleLocationConfirmed = () => {
    setCurrentScreen('timer');
  };



  const handleTimerComplete = (timeSpent: number) => {
    // タイマーの時間を保存してスタンプ獲得画面へ
    setTimerDuration(timeSpent);
    // 獲得するスタンプ情報を設定
    setAcquiredStamp({ name: '箱根湯本温泉', icon: '🌸' });
    setCurrentScreen('stampAcquisition');
  };

  const handleStampAcquisitionComplete = () => {
    // キャラクターの経験値とステータスを更新
    if (character) {
      const expGained = Math.floor(timerDuration * 2); // 1分につき2EXP
      const newExp = character.exp + expGained;
      const levelUp = newExp >= character.maxExp;
      const newLevel = levelUp ? character.level + 1 : character.level;
      const remainingExp = levelUp ? newExp - character.maxExp : newExp;
      
      const updatedCharacter: Character = {
        ...character,
        exp: remainingExp,
        level: newLevel,
        maxExp: newLevel * 100, // レベルに応じて必要経験値増加
        happiness: Math.min(100, character.happiness + 10),
        stamina: Math.min(100, character.stamina + 15),
        onsenCount: character.onsenCount + 1
      };

      setCharacter(updatedCharacter);
      localStorage.setItem('onsenAppCharacter', JSON.stringify(updatedCharacter));
    }
    
    setCurrentScreen('result');
  };

  const handleResultContinue = () => {
    setCurrentScreen('home');
  };

  const handleStartBathing = () => {
    setCurrentScreen('timer');
  };

  const handleTabChange = (tab: TabType) => {
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'bathing':
        // 入浴画面（現在地チェック画面）
        setCurrentScreen('newLocationCheck');
        break;
      case 'settings':
        // 設定画面としてキャラクターデコレーション画面を使用
        setCurrentScreen('decoration');
        break;
    }
  };

  const handleTimerCancel = () => {
    setCurrentScreen('home');
  };

  const calculateExpGained = (timeSpent: number) => {
    return Math.floor(timeSpent * 2);
  };

  const checkLevelUp = (timeSpent: number) => {
    if (!character) return false;
    const expGained = calculateExpGained(timeSpent);
    return character.exp + expGained >= character.maxExp;
  };

  // 画面のレンダリング
  switch (currentScreen) {
    case 'title':
      return <TitleScreen onStart={handleStart} onSettings={handleDebugSettings} />;
      
    case 'nameInput':
      return <NameInputScreen onNext={handleNameInput} initialName={tempUserName} />;
      
    case 'characterSelect':
      return (
        <CharacterNameInputScreen 
          userName={tempUserName}
          characterName={characterName}
          onBack={() => setCurrentScreen('nameInput')}
          onCharacterNameChange={handleCharacterNameChange}
          onComplete={handleCharacterSelect}
        />
      );
      
    case 'home':
      if (!userData || !character) return <div>Loading...</div>;
      return (
        <HomeScreen 
          character={character}
          userName={userData.name}
          onNavigateToStampRally={() => setCurrentScreen('stampRally')}
          onNavigateToDecoration={() => setCurrentScreen('decoration')}
          onTabChange={handleTabChange}
        />
      );
      
    case 'stampRally':
      return (
        <StampRallyScreen 
          onBack={() => setCurrentScreen('home')}
          onSelectOnsen={handleOnsenSelect}
          onTabChange={handleTabChange}
        />
      );
      
    case 'decoration':
      if (!character) return <div>Loading...</div>;
      return (
        <CharacterDecoScreen 
          onBack={() => setCurrentScreen('home')}
          character={character}
          onTabChange={handleTabChange}
        />
      );
      
    case 'locationCheck':
      if (!selectedOnsen) return <div>Loading...</div>;
      return (
        <LocationCheckScreen 
          onsen={selectedOnsen}
          onBack={() => setCurrentScreen('stampRally')}
          onLocationConfirmed={handleLocationConfirmed}
        />
      );
      
    case 'newLocationCheck':
      return (
        <NewLocationCheckScreen 
          onBack={() => setCurrentScreen('home')}
          onStartBathing={handleStartBathing}
        />
      );
      

      
    case 'timer':
      if (!character) return <div>Loading...</div>;
      return (
        <TimerScreen 
          character={character}
          onComplete={handleTimerComplete}
          onCancel={handleTimerCancel}
        />
      );

    case 'stampAcquisition':
      return (
        <StampAcquisitionScreen 
          onComplete={handleStampAcquisitionComplete}
        />
      );
      
    case 'result':
      if (!character) return <div>Loading...</div>;
      const timeSpent = timerDuration; // 実際にはタイマーから取得
      const expGained = calculateExpGained(timeSpent);
      const levelUp = checkLevelUp(timeSpent);
      const newLevel = levelUp ? character.level + 1 : character.level;
      
      if (!acquiredStamp) return <div>Loading...</div>;
      return (
        <ResultScreen 
          timeSpent={timeSpent}
          onsen={{ name: '箱根湯本温泉', image: '', id: 1, location: '箱根', visited: true, distance: 0, difficulty: 'easy' }}
          expGained={expGained}
          levelUp={levelUp}
          newLevel={newLevel}
          character={{
            name: character.name,
            level: character.level,
            exp: character.exp,
            maxExp: character.maxExp
          }}
          acquiredStamp={acquiredStamp}
          onContinue={handleResultContinue}
        />
      );
      
    default:
      return <div>画面エラー</div>;
  }
}
