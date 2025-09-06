"use client";

import { TimerScreen } from "@/components/TimerScreen"

export default function Timer() {
  const character = {
    name: "もちもちうさぎ",
    type: "",
    level: 0,
    exp: 0,
    maxExp: 0,
    happiness: 0,
    stamina: 0,
    onsenCount: 0,
  }
  const handleComplete = () => {
    console.log("handle Complete")
  }
  const handleCancel = () => {
    console.log("handle Cancel")
  }

  return (
    <TimerScreen
      character={character}
      onComplete={handleComplete}
      onCancel={handleCancel} />
  )
}
