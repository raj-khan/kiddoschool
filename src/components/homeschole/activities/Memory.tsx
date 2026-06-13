"use client";

import { useState } from "react";

import { Icon } from "../Icon";
import { Glyph } from "../ds";
import { Cheer, pick } from "./shared";

interface MemoryCard {
  id: string;
  letter: string;
  show: string;
}

export function Memory({ onComplete, big }: { onComplete: () => void; big: boolean }) {
  const [deck] = useState<MemoryCard[]>(() => {
    const letters = pick(["A", "S", "M", "B", "T"], 3);
    const cards: MemoryCard[] = [];
    letters.forEach((L) => {
      cards.push({ id: L + "u", letter: L, show: L });
      cards.push({ id: L + "l", letter: L, show: L.toLowerCase() });
    });
    return cards.sort(() => Math.random() - 0.5);
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  const [cheer, setCheer] = useState(false);

  const flip = (i: number) => {
    if (lock || flipped.includes(i) || matched.includes(deck[i].letter)) return;
    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length === 2) {
      setLock(true);
      const [a, b] = nf;
      if (deck[a].letter === deck[b].letter) {
        setTimeout(() => {
          const nm = [...matched, deck[a].letter];
          setMatched(nm);
          setFlipped([]);
          setLock(false);
          if (nm.length * 2 >= deck.length) {
            setCheer(true);
            setTimeout(() => {
              setCheer(false);
              onComplete();
            }, 1100);
          }
        }, 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 900);
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: big ? 23 : 20, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 24 }}>Find the pairs — big letter and little letter</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: big ? 16 : 13, maxWidth: 440, margin: "0 auto" }}>
        {deck.map((card, i) => {
          const isUp = flipped.includes(i) || matched.includes(card.letter);
          const isMatched = matched.includes(card.letter);
          return (
            <button
              key={card.id}
              onClick={() => flip(i)}
              style={{ aspectRatio: "1", borderRadius: "var(--r-lg)", border: "none", perspective: 600, background: "transparent", padding: 0 }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  transition: "transform .45s cubic-bezier(.2,.8,.3,1)",
                  transform: isUp ? "rotateY(180deg)" : "none"
                }}
              >
                {/* back */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    borderRadius: "var(--r-lg)",
                    background: "var(--sage)",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "var(--shadow-md)"
                  }}
                >
                  <Icon name="seed" size={32} color="#fff" style={{ opacity: 0.85 }} />
                </div>
                {/* front */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: "var(--r-lg)",
                    background: isMatched ? "var(--sage-tint)" : "var(--white)",
                    border: "2px solid " + (isMatched ? "var(--sage)" : "var(--line)"),
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <Glyph char={card.show} color={isMatched ? "var(--sage-deep)" : "var(--ink)"} size={big ? 52 : 44} weight={700} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 16, color: "var(--ink-faint)", marginTop: 22 }}>
        {matched.length} of {deck.length / 2} pairs found
      </p>
      <Cheer show={cheer} text="You remembered!" />
    </div>
  );
}
