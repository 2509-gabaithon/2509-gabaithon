"use client"

import { StampRallyScreen } from "@/components/QuestScreen"
import type { TabType } from '@/components/BottomTabNavigation';

export default function ViewStamp() {
  const handleBack = () => {
    console.log("handleBack")
  }

  const handleSelectQuest = (quest: object) => {
    console.log(`handleSelectOnsen %o`, quest)
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
