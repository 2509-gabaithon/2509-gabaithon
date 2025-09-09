import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Sparkles, Award, Gift } from 'lucide-react';
import { QuestCompletionResult } from '@/utils/supabase/quest';

interface QuestCompletionNotificationProps {
  completions: QuestCompletionResult[];
  onClose: () => void;
  onViewQuests: () => void;
}

export function QuestCompletionNotification({ 
  completions, 
  onClose, 
  onViewQuests 
}: QuestCompletionNotificationProps) {
  // 新規達成したクエストのみを表示
  const newCompletions = completions.filter(c => !c.wasAlreadyCompleted);
  
  // アクセサリ獲得情報を集計
  const accessaryRewards = newCompletions
    .filter(c => c.accessaryReward?.granted)
    .map(c => c.accessaryReward!);

  if (newCompletions.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* 背景の輝きエフェクト */}
        <div className="absolute inset-0 bg-gradient-to-r from-app-main via-app-accent-1 to-app-main rounded-3xl opacity-20 animate-pulse" />
        <div className="absolute inset-0">
          <div className="absolute top-4 left-8 text-yellow-300/60 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute top-8 right-12 text-yellow-200/40 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute bottom-6 left-12 text-yellow-300/50 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="absolute bottom-8 right-8 text-yellow-200/60 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <Card className="relative bg-white/95 backdrop-blur-sm border-app-main shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-app-main to-app-accent-1 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-app-base">
              🎉 クエスト達成！
            </CardTitle>
            <p className="text-app-base-light">
              {newCompletions.length === 1 
                ? 'おめでとうございます！クエストを達成しました。'
                : `おめでとうございます！${newCompletions.length}つのクエストを達成しました。`
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {newCompletions.map((completion) => (
              <div 
                key={completion.questId}
                className="p-3 bg-app-main/10 rounded-lg border border-app-main/20 space-y-2"
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <CheckCircle className="w-6 h-6 text-app-main" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-app-base">
                      {completion.questName}
                    </h3>
                    <Badge className="bg-app-main text-white text-xs">
                      達成済み
                    </Badge>
                  </div>
                </div>
                
                {/* アクセサリ獲得表示 */}
                {completion.accessaryReward?.granted && (
                  <div className="flex items-center mt-2 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-md border border-yellow-200">
                    <div className="mr-2">
                      <Gift className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">
                        🎁 アクセサリ獲得！
                      </p>
                      <p className="text-xs text-yellow-700">
                        {completion.accessaryReward.accessary.name}
                      </p>
                    </div>
                    <Badge className="bg-yellow-500 text-white text-xs">
                      NEW
                    </Badge>
                  </div>
                )}
              </div>
            ))}

            {/* アクセサリ獲得サマリー */}
            {accessaryRewards.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Gift className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-800">
                    獲得したアクセサリ
                  </h4>
                </div>
                <div className="space-y-1">
                  {accessaryRewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-purple-700">
                        {reward.accessary.name}
                      </span>
                      <Badge className="bg-purple-500 text-white text-xs">
                        獲得
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <Button 
                onClick={onViewQuests}
                className="w-full bg-app-main hover:bg-app-main-dark text-white font-semibold py-3"
              >
                クエスト一覧を確認
              </Button>
              <Button 
                onClick={onClose}
                variant="outline"
                className="w-full border-app-base-light text-app-base hover:bg-app-base-light/10"
              >
                閉じる
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
