"use client";

import { NameInputScreen } from "@/components/NameInputScreen";

export default function SetUserName() {
  const handleNext = (userName: string) => {
    console.log("ユーザー名が設定されました:", userName);
  };

  return <NameInputScreen userName="ユーザー名" onNext={handleNext} />;
}
