"use client"

import { StampRallyScreen } from "@/components/QuestScreen"
import type { TabType } from '@/components/BottomTabNavigation';
import type { Quest } from '@/utils/supabase/quest';

export default function ViewStamp() {
  const handleBack = () => {
    console.log("handleBack")
  }

  const handleSelectQuest = (quest: Quest) => {
    console.log(`handleSelectQuest %o`, quest)
  }

  const handleTabChange = (tabType: TabType) => {
    console.log(`handleTabChange: ${tabType}`)
  }
  
  return (
    <StampRallyScreen
      onBack={handleBack}
      onSelectQuest={handleSelectQuest}
      onTabChange={handleTabChange} />    
  )
}
