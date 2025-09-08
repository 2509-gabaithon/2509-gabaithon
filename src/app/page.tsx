"use client"

import React, { useState, useEffect } from 'react';
import { TitleScreen } from '@/components/TitleScreen';
import { NameInputScreen } from '@/components/NameInputScreen';
import { CharacterNameInputScreen } from '@/components/CharacterNameInputScreen';
import { HomeScreen } from '@/components/HomeScreen';
import { StampRallyScreen as QuestScreen } from '@/components/QuestScreen';
import { CharacterDecoScreen } from '@/components/CharacterDecoScreen';
import { LocationCheckScreen } from '@/components/LocationCheckScreen';
import { NewLocationCheckScreen } from '@/components/NewLocationCheckScreen';
import { TimerScreen } from '@/components/TimerScreen';
import { StampAcquisitionScreen } from '@/components/StampAcquisitionScreen';
import { ResultScreen } from '@/components/ResultScreen';
import { TabType } from '@/components/BottomTabNavigation';
import mochiusa from '@/assets/ac6d9ab22063d00cb690b5d70df3dad88375e1a0.png'
import ureshinoStamp from '@/assets/23d72f267674d7a86e5a4d3966ba367d52634bd9.png'
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { accounts, CredentialResponse } from 'google-one-tap'
import type { User } from '@supabase/supabase-js';

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

declare const google: { accounts: accounts }

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('title');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<User | null>(null); // 認証ユーザー状態
  const [authLoading, setAuthLoading] = useState(true); // 認証状態のローディング
  const [tempUserName, setTempUserName] = useState<string>('');
  const [characterName, setCharacterName] = useState<string>('');
  const [currentCharacter, setCurrentCharacter] = useState<Character>({
    name: '',
    type: 'sakura-san',
    level: 1,
    exp: 0,
    maxExp: 100,
    happiness: 80,
    stamina: 100,
    onsenCount: 0
  });
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [acquiredStamp, setAcquiredStamp] = useState<{ name: string; icon: string } | null>(null);
  
  const supabase = createClient(); // クライアントを一度だけ作成

  // 認証状態の監視とセッション取得
  useEffect(() => {
    let mounted = true;

    // 初期セッション取得（安全なエラーハンドリング付き）
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Initial session error:', error.message);
          return;
        }
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            console.log('Initial session found:', session.user);
          } else {
            setUser(null);
            console.log('No initial session');
          }
        }
      } catch (err) {
        console.warn('Failed to get initial session:', err);
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    // 認証状態変更の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setAuthLoading(false);
          } else {
            setUser(null);
            setAuthLoading(false);
          }
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleStart = async () => {
    // 認証状態がまだ読み込み中の場合は待機
    if (authLoading) {
      console.log('Auth still loading, please wait...');
      return;
    }

    // 未認証の場合は認証フローを開始
    if (!user) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: process.env.NEXT_PUBLIC_CALLBACK_URL || 'http://localhost:3000/auth/callback',
          }
        });
        if (error) {
          console.error('Error during sign-in:', error);
          return;
        }
        console.log('Sign-in initiated:', data);
        return; // 認証フロー開始後は処理を終了
      } catch (err) {
        console.error('Sign-in failed:', err);
        return;
      }
    }

    console.log('User authenticated:', user);

    // 認証済みの場合は画面遷移
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
    setCurrentCharacter(newCharacter);
    
    // ローカルストレージに保存
    localStorage.setItem('onsenAppUser', JSON.stringify(newUserData));
    localStorage.setItem('onsenAppCharacter', JSON.stringify(newCharacter));
    
    setCurrentScreen('home');
  };



  const handleOnsenSelect = (onsen: any) => {
    setSelectedLocation(onsen);
    setCurrentScreen('locationCheck');
  };

  const handleLocationConfirmed = () => {
    setCurrentScreen('timer');
  };



  const handleTimerComplete = (timeSpent: number) => {
    // タイマーの時間を保存してスタンプ獲得画面へ
    setTimerDuration(timeSpent);
    // 獲得するスタンプ情報を設定
    setAcquiredStamp({ name: '箱根湯本温泉', icon: ureshinoStamp.src });
    setCurrentScreen('stampAcquisition');
  };

  const handleStampAcquisitionComplete = () => {
    // キャラクターの経験値とステータスを更新
    if (currentCharacter) {
      const expGained = Math.floor(timerDuration * 2); // 1分につき2EXP
      const newExp = currentCharacter.exp + expGained;
      const levelUp = newExp >= currentCharacter.maxExp;
      const newLevel = levelUp ? currentCharacter.level + 1 : currentCharacter.level;
      const remainingExp = levelUp ? newExp - currentCharacter.maxExp : newExp;
      
      const updatedCharacter: Character = {
        ...currentCharacter,
        exp: remainingExp,
        level: newLevel,
        maxExp: newLevel * 100, // レベルに応じて必要経験値増加
        happiness: Math.min(100, currentCharacter.happiness + 10),
        stamina: Math.min(100, currentCharacter.stamina + 15),
        onsenCount: currentCharacter.onsenCount + 1
      };

      setCurrentCharacter(updatedCharacter);
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
    if (!currentCharacter) return false;
    const expGained = calculateExpGained(timeSpent);
    return currentCharacter.exp + expGained >= currentCharacter.maxExp;
  };

  // 画面のレンダリング
  switch (currentScreen) {
    case 'title':
      return <TitleScreen onStart={handleStart} onSettings={handleDebugSettings} />;
      
    case 'nameInput':
      return <NameInputScreen onNext={handleNameInput} userName={tempUserName} />;
      
    case 'characterSelect':
      return (
        <CharacterNameInputScreen 
          userName={tempUserName}
          character={{...currentCharacter!, id: currentCharacter!.type, description: 'ここにパートナーの説明が入る', image: mochiusa}}
          onBack={() => setCurrentScreen('nameInput')}
          onCharacterNameChange={handleCharacterNameChange}
          onComplete={handleCharacterSelect}
        />
      );
      
    case 'home':
      if (!userData || !currentCharacter) return <div>Loading...</div>;
      return (
        <HomeScreen 
          character={currentCharacter}
          onNavigateToStampRally={() => setCurrentScreen('stampRally')}
          onNavigateToDecoration={() => setCurrentScreen('decoration')}
          onTabChange={handleTabChange}
        />
      );
      
    case 'stampRally':
      return (
        <QuestScreen 
          onBack={() => setCurrentScreen('home')}
          onSelectQuest={handleOnsenSelect}
          onTabChange={handleTabChange}
        />
      );
      
    case 'decoration':
      if (!currentCharacter) return <div>Loading...</div>;
      return (
        <CharacterDecoScreen 
          onBack={() => setCurrentScreen('home')}
          character={currentCharacter}
          onTabChange={handleTabChange}
        />
      );
      
    case 'locationCheck':
      if (!selectedLocation) return <div>Loading...</div>;
      return (
        <LocationCheckScreen 
          onsen={selectedLocation}
          onBack={() => setCurrentScreen('stampRally')}
          onLocationConfirmed={handleLocationConfirmed}
        />
      );
      
    case 'newLocationCheck':
      return (
        <NewLocationCheckScreen 
          character={currentCharacter!}
          onBack={() => setCurrentScreen('home')}
          onStartBathing={handleStartBathing}
        />
      );
      

      
    case 'timer':
      if (!currentCharacter) return <div>Loading...</div>;
      return (
        <TimerScreen 
          character={currentCharacter}
          onComplete={handleTimerComplete}
          onCancel={handleTimerCancel}
        />
      );

    case 'stampAcquisition':
      return (
        <StampAcquisitionScreen 
          acquiredStamp={acquiredStamp!}
          onComplete={handleStampAcquisitionComplete}
        />
      );
      
    case 'result':
      if (!currentCharacter) return <div>Loading...</div>;
      const timeSpent = timerDuration; // 実際にはタイマーから取得
      const expGained = calculateExpGained(timeSpent);
      const levelUp = checkLevelUp(timeSpent);
      const newLevel = levelUp ? currentCharacter.level + 1 : currentCharacter.level;
      
      if (!acquiredStamp) return <div>Loading...</div>;
      return (
        <ResultScreen 
          expGained={expGained}
          levelUp={levelUp}
          newLevel={newLevel}
          character={currentCharacter}
          acquiredStamp={acquiredStamp}
          onNavigateToCharacter={handleResultContinue}
        />
      );
      
    default:
      return <div>画面エラー</div>;
  }
}
