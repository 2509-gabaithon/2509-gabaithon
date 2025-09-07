"use client"

import { CharacterDecoScreen } from "@/components/CharacterDecoScreen"

export default function DecorateCharacter() {
  const character = {
    name: "もちもちうさぎ",
    type: "sakura-san",
    level: 0,
  }

  const handleBack = () => {
    console.log("handleBack")
  }

  const handleTabChange = (tabType: string) => {
    console.log(`handleTabChange: ${tabType}`)
  }
  
  return (
    <CharacterDecoScreen
      character={character}
      onBack={handleBack}
      onTabChange={handleTabChange} />
  )
}
