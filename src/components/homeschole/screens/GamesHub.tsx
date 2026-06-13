"use client";

import { Icon } from "../Icon";
import { Pic } from "../illustrations";
import { AppCanvas, Card, Chip, Eyebrow, FadeIn, Glyph, IconBadge } from "../ds";
import { isVowel } from "../games/GameComplete";
import { GAME_META } from "@/lib/homeschole/activity-meta";
import type { GameId } from "@/lib/homeschole/activity-meta";
import type { ChildProfile } from "@/lib/homeschole/profile";

export function GamesHub({ profile, onPlay }: { profile: ChildProfile; onPlay: (id: GameId) => void }) {
  const featured = GAME_META.word;
  const others = [GAME_META.sound, GAME_META.memory];
  return (
    <AppCanvas max={720}>
      <div style={{ paddingTop: 40, paddingBottom: 140 }}>
        <FadeIn>
          <Eyebrow color="var(--honey-deep)">Play &amp; learn</Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,7vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "10px 0 6px" }}>The Playroom</h1>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 30, lineHeight: 1.5, maxWidth: 460 }}>
            Open, unhurried games {profile.name} can return to any time. No timers, no pressure — just gentle play.
          </p>
        </FadeIn>

        {/* featured */}
        <FadeIn delay={0.06}>
          <Card pad={0} radius="var(--r-xl)" hover onClick={() => onPlay(featured.id)} style={{ overflow: "hidden", marginBottom: 18, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 26px 8px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 240px" }}>
                <Chip color={featured.deep} tint={featured.tint} icon="sparkle" style={{ pointerEvents: "none", marginBottom: 12 }}>
                  Featured
                </Chip>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>{featured.title}</div>
                <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.5, maxWidth: 320 }}>{featured.desc}</p>
              </div>
              <Pic name="cat" size={96} />
            </div>
            {/* movable-alphabet preview */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 26px 26px" }}>
              {"cat".split("").map((ch, i) => (
                <div
                  key={i}
                  style={{
                    width: 50,
                    height: 56,
                    borderRadius: 14,
                    background: "var(--cream)",
                    border: "1px solid var(--sand-deep)",
                    boxShadow: "var(--shadow-sm)",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  <Glyph char={ch} size={30} color={isVowel(ch) ? "var(--coral-deep)" : "var(--ink)"} weight={700} />
                </div>
              ))}
              <div style={{ marginLeft: "auto", width: 52, height: 52, borderRadius: "50%", background: featured.color, display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)" }}>
                <Icon name="next" size={24} color="#fff" stroke={2.4} />
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* other games */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="lin-resp-grid">
          {others.map((g, i) => (
            <FadeIn key={g.id} delay={0.12 + i * 0.06}>
              <Card pad={22} hover onClick={() => onPlay(g.id)} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <IconBadge name={g.icon} color={g.color} tint={g.tint} size={52} />
                  <Chip color={g.deep} tint={g.tint} style={{ pointerEvents: "none", padding: "6px 12px", fontSize: 13 }}>
                    {g.tag}
                  </Chip>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 16 }}>{g.title}</div>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 5, flex: 1 }}>{g.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, color: g.deep, fontWeight: 700, fontSize: 15 }}>
                  <Icon name="play" size={18} color={g.deep} /> Play
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </AppCanvas>
  );
}
