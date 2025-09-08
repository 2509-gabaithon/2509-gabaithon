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
import { createClient } from '@/utils/supabase/server';
import { useRouter } from 'next/router';
import type { accounts, CredentialResponse } from 'google-one-tap'

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [character, setCharacter] = useState<Character | null>({
        name: 'もちもちうさぎ',
        type: "aaa",
        level: 1,
        exp: 0,
        maxExp: 100,
        happiness: 80,
        stamina: 100,
        onsenCount: 0
      });
  const [tempUserName, setTempUserName] = useState<string>('');
  const [characterName, setCharacterName] = useState<string>('もちもちうさぎ');
  const [selectedOnsen, setSelectedOnsen] = useState<OnsenStamp | null>(null);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [acquiredStamp, setAcquiredStamp] = useState<{ name: string; icon: string } | null>(null);


  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(nonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return [nonce, hashedNonce]
}
  //ユーザーが最初のログインかどうかを認証する
  const router = useRouter()
  const initializeGoogleOneTap = async () => {
    const supabase = await createClient()
    console.log('Initializing Google One Tap')
    const [nonce, hashedNonce] = await generateNonce()
    console.log('Nonce: ', nonce, hashedNonce)
    // check if there's already an existing session before initializing the one-tap UI
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session', error)
    }
    if (data.session) {
      router.push('/')
      return
    }
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: CredentialResponse) => {
        try {
          // send id token returned in response.credential to supabase
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce,
          })
          if (error) throw error
          console.log('Session data: ', data)
          console.log('Successfully logged in with Google One Tap')
          // redirect to protected page
          router.push('/')
        } catch (error) {
          console.error('Error logging in with Google One Tap', error)
        }
      },
      nonce: hashedNonce,
      // with chrome's removal of third-party cookies, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
      use_fedcm_for_prompt: true,
    })
    google.accounts.id.prompt() // Display the One Tap UI
  }

  const handleStart = () => {
    //認証のチェック
    initializeGoogleOneTap()

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
    setAcquiredStamp({ name: '箱根湯本温泉', icon: ureshinoStamp.src });
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
      return <NameInputScreen onNext={handleNameInput} userName={tempUserName} />;
      
    case 'characterSelect':
      return (
        <CharacterNameInputScreen 
          userName={tempUserName}
          character={{...character!, id: character!.type, description: 'ここにパートナーの説明が入る', image: mochiusa}}
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
          character={character!}
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
          acquiredStamp={acquiredStamp!}
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
          expGained={expGained}
          levelUp={levelUp}
          newLevel={newLevel}
          character={character}
          acquiredStamp={acquiredStamp}
          onNavigateToCharacter={handleResultContinue}
        />
      );
      
    default:
      return <div>画面エラー</div>;
  }
}
