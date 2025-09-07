import React from 'react';
import { Home, Settings, Droplets } from 'lucide-react';

export type TabType = 'home' | 'bathing' | 'settings' | 'none';

interface BottomTabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'bathing', label: '入浴', icon: Droplets },
  { id: 'settings', label: '設定', icon: Settings },
];

export function BottomTabNavigation({ activeTab, onTabChange }: BottomTabNavigationProps) {
  const renderTabButton = (tab: TabItem) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    const isBathing = tab.id === 'bathing';
    
    if (isBathing) {
      // 入浴ボタンは大きな円形
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full transition-all duration-300 shadow-2xl border-4 border-white ${
            isActive
              ? 'bg-gradient-to-br from-app-main via-app-main-dark to-app-main text-white scale-110 shadow-app-main/60'
              : 'bg-gradient-to-br from-app-main-light via-app-main to-app-main-dark text-white hover:scale-105 hover:shadow-app-main/50 hover:shadow-lg'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <Icon className="w-10 h-10" />
          </div>
        </button>
      );
    }
    
    // 通常のタブボタン
    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
          isActive
            ? 'text-app-main bg-app-main/15 shadow-sm scale-105'
            : 'text-app-base hover:text-app-main-dark hover:bg-app-accent-2 hover:scale-105'
        }`}
      >
        <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-app-main' : 'text-app-base'}`} />
        <span className={`text-xs font-medium ${isActive ? 'text-app-main' : 'text-app-base'}`}>
          {tab.label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <div className="relative">
        {/* メインナビゲーションバー */}
        <div className="bg-white border border-app-base/20 shadow-xl rounded-2xl max-w-md mx-auto">
          <div className="flex items-center py-3 px-6">
            {/* 左側：設定 */}
            <div className="flex-1 flex justify-center">
              {renderTabButton(tabs.find(tab => tab.id === 'settings')!)}
            </div>
            
            {/* 中央：スペース（円形ボタンの場所） */}
            <div className="w-16"></div>
            
            {/* 右側：ホーム */}
            <div className="flex-1 flex justify-center">
              {renderTabButton(tabs.find(tab => tab.id === 'home')!)}
            </div>
          </div>
        </div>
        
        {/* 円形の入浴ボタン */}
        {renderTabButton(tabs.find(tab => tab.id === 'bathing')!)}
        
        {/* 入浴ボタンの下にラベル */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <span className={`text-xs font-medium ${
            activeTab === 'bathing' ? 'text-app-main' : 'text-app-base'
          }`}>
            入浴
          </span>
        </div>
      </div>
    </div>
  );
}