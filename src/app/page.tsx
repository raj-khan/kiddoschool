import dynamic from "next/dynamic";

const TypingGame = dynamic(
  () => import("@/components/TypingGame").then((m) => ({ default: m.TypingGame })),
  { ssr: false }
);

export default function HomePage() {
  return <TypingGame />;
}
