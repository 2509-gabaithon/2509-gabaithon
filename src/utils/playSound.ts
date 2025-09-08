export function playSound(fileName: string) {
  const audio = new Audio(`/sounds/${fileName}`);
  audio.play().catch((error) => {
    console.error("音声の再生に失敗しました:", error);
  });
}
