import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { BottomTabNavigation, TabType } from './BottomTabNavigation';

interface OnsenStamp {
  id: number;
  name: string;
  location: string;
  image: string;
  visited: boolean;
  distance: number;
  difficulty: string;
}

interface StampRallyScreenProps {
  onBack: () => void;
  onSelectOnsen: (onsen: OnsenStamp) => void;
  onTabChange?: (tab: TabType) => void;
}

const mockStamps: OnsenStamp[] = [
  {
    id: 1,
    name: "箱根湯本温泉",
    location: "神奈川県箱根町",
    image: "https://images.unsplash.com/photo-1672026431306-fca8fba1d14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGhvdCUyMHNwcmluZyUyMG9uc2VuJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzU2ODE0OTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    visited: true,
    distance: 0.5,
    difficulty: "初級"
  },
  {
    id: 2,
    name: "乳頭温泉郷",
    location: "秋田県仙北市",
    image: "https://images.unsplash.com/photo-1732721776092-0261e7b39144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwaG90JTIwc3ByaW5nJTIwbmF0dXJlJTIwbW91bnRhaW58ZW58MXx8fHwxNzU2ODE0OTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    visited: false,
    distance: 2.3,
    difficulty: "上級"
  },
  {
    id: 3,
    name: "有馬温泉",
    location: "兵庫県神戸市",
    image: "https://images.unsplash.com/photo-1554424518-336ec861b705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjB3ZWxsbmVzcyUyMHJlbGF4YXRpb258ZW58MXx8fHwxNzU2ODE0OTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    visited: false,
    distance: 1.2,
    difficulty: "中級"
  }
];

export function StampRallyScreen({ onBack, onSelectOnsen, onTabChange }: StampRallyScreenProps) {
  const visitedCount = mockStamps.filter(stamp => stamp.visited).length;
  const totalCount = mockStamps.length;
  const progressPercentage = (visitedCount / totalCount) * 100;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-accent-1-light to-white p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-app-base">スタンプラリー</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">進捗状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-app-base">
                {visitedCount} / {totalCount}
              </span>
              <p className="text-app-base-light">温泉コンプリート</p>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-center text-sm text-app-base-light">
              {progressPercentage.toFixed(0)}% 達成
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {mockStamps.map((stamp) => (
            <Card 
              key={stamp.id} 
              className={`cursor-pointer transition-all ${
                stamp.visited ? 'bg-app-accent-2 border-app-main' : 'hover:shadow-md'
              }`}
              onClick={() => onSelectOnsen(stamp)}
            >
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="relative">
                    <ImageWithFallback
                      src={stamp.image}
                      alt={stamp.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    {stamp.visited && (
                      <CheckCircle className="absolute -top-2 -right-2 h-6 w-6 text-app-main bg-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold">{stamp.name}</h3>
                      <Badge className={getDifficultyColor(stamp.difficulty)}>
                        {stamp.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center mb-2 text-sm text-app-base-light">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="mr-3">{stamp.location}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{stamp.distance}km</span>
                    </div>
                    
                    {stamp.visited ? (
                      <Badge className="bg-app-main">
                        ✓ 訪問済み
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        未訪問
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="font-bold mb-2">🏆 コンプリート特典</h3>
              <p className="text-sm text-app-base-light">
                全ての温泉を巡ると特別なキャラクターアイテムがもらえます！
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomTabNavigation 
        activeTab="bathing" 
        onTabChange={handleTabChange}
      />
    </div>
  );
}