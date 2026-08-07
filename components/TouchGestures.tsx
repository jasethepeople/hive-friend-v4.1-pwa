"use client";
import { useEffect, useRef, useState, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
export function TouchGestures({ children, onRefresh }: { children: ReactNode; onRefresh?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pulling, setPulling] = useState(false);
  const [dist, setDist] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => { const t = e.touches[0]; start.current = { x: t.clientX, y: t.clientY }; if (window.scrollY === 0) setPulling(true); };
    const onMove = (e: TouchEvent) => { if (!pulling) return; const dy = e.touches[0].clientY - start.current.y; if (dy > 0 && dy < 150) { setDist(dy); e.preventDefault(); } };
    const onEnd = () => {
      if (!pulling) return;
      setPulling(false);
      if (dist > 80) { setRefreshing(true); onRefresh?.(); setTimeout(() => { setRefreshing(false); setDist(0); }, 1500); }
      else setDist(0);
    };
    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    return () => { el.removeEventListener("touchstart", onStart); el.removeEventListener("touchmove", onMove); el.removeEventListener("touchend", onEnd); };
  }, [pulling, dist, onRefresh]);
  return (
    <div ref={ref} className="relative touch-pan-y">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-transform" style={{ transform: `translateY(${Math.min(dist - 60, 0)}px)`, opacity: dist > 20 ? 1 : 0, pointerEvents: "none" }}>
        <div className="bg-hive-panel border border-hive-border rounded-full p-3 shadow-lg">
          <RefreshCw className={`w-5 h-5 text-hive-accent ${refreshing ? "animate-spin" : ""}`} style={{ transform: `rotate(${dist * 2}deg)` }} />
        </div>
      </div>
      <div style={{ transform: `translateY(${dist > 0 ? dist * 0.5 : 0}px)` }}>{children}</div>
    </div>
  );
}