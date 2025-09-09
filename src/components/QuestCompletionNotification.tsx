import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Sparkles, Award } from 'lucide-react';
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
                className="flex items-center p-3 bg-app-main/10 rounded-lg border border-app-main/20"
              >
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
            ))}

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
