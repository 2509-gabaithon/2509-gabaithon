import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { BottomTabNavigation, TabType } from './BottomTabNavigation';
import { Quest, getQuestsWithProgress } from '@/utils/supabase/quest';
import stampImage from '@/assets/23d72f267674d7a86e5a4d3966ba367d52634bd9.png';
import noiseTexture from '@/assets/221bcc06007de28e2dedf86e88d0a2798eac78e7.png';

interface QuestListScreenProps {
  onBack: () => void;
  onSelectQuest: (quest: Quest) => void;
  onTabChange?: (tab: TabType) => void;
}

export function StampRallyScreen({ onBack, onSelectQuest, onTabChange }: QuestListScreenProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // クエストデータを取得
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        setLoading(true);
        setError(null);
        const questData = await getQuestsWithProgress();
        setQuests(questData);
      } catch (err) {
        console.error('クエストデータ取得エラー:', err);
        setError(err instanceof Error ? err.message : 'クエストデータの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  const completedCount = quests.filter(quest => quest.isCompleted).length;
  const totalCount = quests.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleTabChange = (tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '初級': return 'bg-app-main';
      case '中級': return 'bg-app-accent-1-dark';
      case '上級': return 'bg-app-base';
      default: return 'bg-gray-500';
    }
  };

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main relative overflow-hidden p-4 pb-32">
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={onBack} className="mr-2 p-2 text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">クエスト一覧</h1>
          </div>
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-app-base">クエストデータを読み込み中...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main relative overflow-hidden p-4 pb-32">
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={onBack} className="mr-2 p-2 text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">クエスト一覧</h1>
          </div>
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-app-main hover:bg-app-main-dark">
                再読み込み
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-base via-app-main-dark to-app-main relative overflow-hidden p-4 pb-32">
      {/* Background sparkles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 text-white/30 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute top-32 right-16 text-white/20 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute top-48 left-20 text-white/25 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute bottom-32 right-10 text-white/30 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-48 left-14 text-white/20 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2 p-2 text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">クエスト一覧</h1>
        </div>

        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-app-base">進捗状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-app-base">
                {completedCount} / {totalCount}
              </span>
              <p className="text-app-base-light">クエスト完了</p>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-center text-sm text-app-base-light">
              {progressPercentage.toFixed(0)}% 達成
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {quests.map((quest: Quest) => (
            <Card 
              key={quest.id} 
              className={`cursor-pointer transition-all bg-white/95 backdrop-blur-sm ${
                quest.isCompleted 
                  ? 'border-2 border-green-400 shadow-lg shadow-green-100' 
                  : 'border border-gray-200 hover:shadow-md hover:bg-white hover:border-gray-300'
              }`}
              onClick={() => onSelectQuest(quest)}
            >
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="relative">
                    {/* スタンプ画像 */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white">
                      <img
                        src={quest.image || stampImage.src}
                        alt={quest.name}
                        className="w-16 h-16 object-cover relative z-10"
                        onError={(e) => {
                          // 画像読み込み失敗時はフォールバック画像を使用
                          (e.target as HTMLImageElement).src = stampImage.src;
                        }}
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
                        className="absolute inset-0 w-16 h-16 opacity-25 pointer-events-none z-20 rounded-xl"
                        style={{
                          backgroundImage: `url(${noiseTexture.src})`,
                          backgroundSize: '64px 64px',
                          backgroundRepeat: 'repeat',
                          mixBlendMode: 'screen',
                          mask: `url(${quest.image || stampImage.src})`,
                          maskSize: 'cover',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMask: `url(${quest.image || stampImage.src})`,
                          WebkitMaskSize: 'cover',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center'
                        }}
                      />

                      {/* 印影効果 */}
                      <div 
                        className="absolute inset-0 w-16 h-16 opacity-20 pointer-events-none z-15 rounded-xl"
                        style={{
                          background: `radial-gradient(ellipse at center, transparent 50%, rgba(93, 104, 138, 0.4) 65%, rgba(93, 104, 138, 0.6) 75%, transparent 90%)`,
                          mixBlendMode: 'multiply',
                          mask: `url(${quest.image || stampImage.src})`,
                          maskSize: 'cover',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMask: `url(${quest.image || stampImage.src})`,
                          WebkitMaskSize: 'cover',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center'
                        }}
                      />
                    </div>
                    
                    {quest.isCompleted && (
                      <CheckCircle className="absolute -top-2 -right-2 h-6 w-6 text-app-main bg-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-app-base">{quest.name}</h3>
                      <Badge className={getDifficultyColor(quest.difficulty || '初級')}>
                        {quest.difficulty || '初級'}
                      </Badge>
                    </div>
                    
                    {/* 改善された完了状況表示 */}
                    <div className="flex items-center justify-between">
                      {quest.isCompleted ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                              <CheckCircle className="w-2 h-2 text-white" />
                            </div>
                            <Badge className="bg-green-500 text-white border-green-500">
                              ✅ 完了済み
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-gray-300 rounded-full mr-2"></div>
                          <Badge variant="outline" className="border-gray-300 text-gray-500">
                            ⚪ 未完了
                          </Badge>
                        </div>
                      )}
                      
                      {/* 温泉数表示 */}
                      <span className="text-sm text-app-base-light">
                        {quest.onsenCount || 0}ヶ所
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <BottomTabNavigation 
        activeTab="none" 
        onTabChange={handleTabChange}
      />
    </div>
  );
}
