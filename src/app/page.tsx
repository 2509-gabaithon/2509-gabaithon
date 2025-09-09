"use client"

import React, { useState, useEffect, useCallback } from 'react';
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
import { insertNyuyokuLog, NyuyokuLogResult } from '@/utils/supabase/nyuyoku-log';
import { QuestCompletionResult } from '@/utils/supabase/quest';
import { getUserPartner, calculateLevel, getExpToNextLevel } from '@/utils/supabase/user-partner';
import { QuestCompletionNotification } from '@/components/QuestCompletionNotification';
import type { accounts, CredentialResponse } from 'google-one-tap'
import type { User } from '@supabase/supabase-js';
import { updateUserProfile } from '@/utils/supabase/profile';
import { updateUserPartner } from '@/utils/supabase/user-partner';

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

interface OnsenDetail {
  name: string;
  place_id: string;
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
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
  const [selectedOnsen, setSelectedOnsen] = useState<string>('');
  const [currentCharacter, setCurrentCharacter] = useState<Character>({
    name: 'もちもちうさぎ',
    type: 'sakura-san',
    level: 1,
    exp: 0,
    maxExp: 100,
    happiness: 80,
    stamina: 100,
    onsenCount: 0
  });
  const [selectedLocation, setSelectedLocation] = useState<OnsenDetail | null>(null);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [acquiredStamp, setAcquiredStamp] = useState<{ name: string; icon: string } | null>(null);
  const [questCompletions, setQuestCompletions] = useState<QuestCompletionResult[]>([]);
  const [showQuestNotification, setShowQuestNotification] = useState(false);
  
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
            // ユーザー認証後にキャラクター情報を取得
            await loadUserPartnerData();
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
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setAuthLoading(false);
            // ユーザー認証後にキャラクター情報を取得
            await loadUserPartnerData();
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

  // user_partnerからキャラクター情報を読み込む
  const loadUserPartnerData = async () => {
    try {
      const userPartner = await getUserPartner();
      if (userPartner) {
        const level = calculateLevel(userPartner.exp);
        const nextLevelExp = Math.pow(level, 2) * 100; // 次のレベルに必要な総経験値
        const maxExp = nextLevelExp;

        setCurrentCharacter({
          name: userPartner.name || 'もちもちうさぎ',
          type: 'sakura-san',
          level: level,
          exp: userPartner.exp,
          maxExp: maxExp,
          happiness: userPartner.happiness,
          stamina: 100, // スタミナはuser_partnerテーブルにないので固定値
          onsenCount: 0 // 温泉カウントは別途計算が必要
        });
        
        console.log('User partner data loaded:', userPartner);
      }
    } catch (error) {
      console.warn('Failed to load user partner data:', error);
    }
  };

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

  const handleCharacterNameChange = useCallback((name: string) => {
    setCharacterName(name);
  }, []);

  const handleCharacterSelect = async () => {
    const nameToUse = characterName.trim() || 'もちもちうさぎ';
    if (!nameToUse) return;
    
    const newUserData: UserData = {
      name: tempUserName,
      characterType: 'sakura-san',
      isFirstTime: true
    };

    setUserData(newUserData);
    
    try {
      // user_partnerのキャラクター名を更新
      await updateUserPartner({ name: nameToUse });
      
      // 更新後のデータを再読み込み
      await loadUserPartnerData();
      
      console.log('Character name updated:', nameToUse);
    } catch (error) {
      console.error('Failed to update character name:', error);
    }
    
    // DBにユーザープロフィールを保存
    updateUserProfile({id: user?.id!, name: newUserData.name})
    
    setCurrentScreen('home');
  };



  const handleOnsenSelect = (onsen: any) => {
    setSelectedLocation(onsen);
    setCurrentScreen('locationCheck');
  };

  const handleLocationConfirmed = () => {
    setCurrentScreen('timer');
  };



  const handleTimerComplete = async (data: { timeSpent: number; startTime: Date; endTime: Date }) => {
    try {
      // タイマーの時間を保存してスタンプ獲得画面へ
      setTimerDuration(data.timeSpent);
      setTimerStartTime(data.startTime);
      
      // nyuyoku_log にデータを保存し、クエスト達成判定を実行
      if (selectedLocation && user) {
        const logData = {
          total_ms: data.timeSpent * 60 * 1000, // 分をミリ秒に変換
          started_at: data.startTime.toISOString(),
          ended_at: data.endTime.toISOString(),
          onsen_name: selectedLocation.name,
          onsen_place_id: selectedLocation.place_id,
          onsen_lat: selectedLocation.geometry.location.lat(),
          onsen_lng: selectedLocation.geometry.location.lng()
        };
        
        const result: NyuyokuLogResult = await insertNyuyokuLog(logData);
        console.log('入浴ログを保存しました');
        
        // クエスト達成があった場合は通知を設定
        if (result.questCompletions.length > 0) {
          setQuestCompletions(result.questCompletions);
          setShowQuestNotification(true);
          console.log('クエスト達成:', result.questCompletions);
        }
      }
      
      // 獲得するスタンプ情報を設定
      setAcquiredStamp({ name: selectedOnsen || '未選択', icon: ureshinoStamp.src });
      setCurrentScreen('stampAcquisition');
    } catch (error) {
      console.error('入浴ログ保存エラー:', error);
      // エラーが発生してもスタンプ獲得画面には進む
      setAcquiredStamp({ name: selectedOnsen || '未選択', icon: ureshinoStamp.src });
      setCurrentScreen('stampAcquisition');
    }
  };

  const handleQuestNotificationClose = () => {
    setShowQuestNotification(false);
    setQuestCompletions([]);
  };

  const handleViewQuests = () => {
    setShowQuestNotification(false);
    setQuestCompletions([]);
    setCurrentScreen('stampRally');
  };

  const handleStampAcquisitionComplete = async () => {
    // 入浴記録保存後、DBトリガーで自動更新されたuser_partnerデータを再読み込み
    await loadUserPartnerData();
    
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
  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return <TitleScreen onStart={handleStart} onSettings={handleDebugSettings} />;
        
      case 'nameInput':
        return <NameInputScreen onNext={handleNameInput} userName={tempUserName} />;
        
      case 'characterSelect':
        return (
          <CharacterNameInputScreen 
            userName={tempUserName}
            character={{
              ...currentCharacter!, 
              id: currentCharacter!.type,
              name: currentCharacter!.name || 'もちもちうさぎ', 
              description: 'もちもちしたウサギの妖精。温泉のあとのコーヒー牛乳がすき。', 
              image: mochiusa
            }}
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
      // 旧フロー: selectedLocation が OnsenStamp 型の場合
      if (!selectedLocation) return <div>Loading...</div>;
      return (
        <LocationCheckScreen 
          onsen={selectedLocation as any} // 型キャストで一時的に対応
          onBack={() => setCurrentScreen('stampRally')}
          onLocationConfirmed={handleLocationConfirmed}
        />
      );
      
    case 'newLocationCheck':
      return (
        <NewLocationCheckScreen 
          setOnsen={setSelectedOnsen}
          setOnsenDetail={setSelectedLocation}
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
          acquiredStamps={[acquiredStamp]}
          onNavigateToCharacter={handleResultContinue}
        />
      );
      
      default:
        return <div>画面エラー</div>;
    }
  };

  // メインレンダリング
  return (
    <div>
      {renderScreen()}
      
      {/* クエスト達成通知オーバーレイ */}
      {showQuestNotification && (
        <QuestCompletionNotification
          completions={questCompletions}
          onClose={handleQuestNotificationClose}
          onViewQuests={handleViewQuests}
        />
      )}
    </div>
  );
}
