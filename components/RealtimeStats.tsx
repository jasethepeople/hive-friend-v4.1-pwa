"use client";
import { useHiveWebSocket } from "@/lib/websocket";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { useMemo } from "react";
export function RealtimeStats() {
  const { connected, messages } = useHiveWebSocket(["metrics", "members"]);
  const metrics = useMemo(() => {
    const msgs = messages.filter(m => m.type === "metrics");
    if (!msgs.length) return null;
    const agg = { total: 0, alive: 0, inferences: 0, anchors: 0, rx: 0, tx: 0 };
    msgs.slice(0, 3).forEach(m => { const d = m.data; agg.total += d.total || 0; agg.alive += d.alive || 0; agg.inferences += d.inferences || 0; agg.anchors += d.anchors || 0; agg.rx += d.rx || 0; agg.tx += d.tx || 0; });
    return agg;
  }, [messages]);
  const clusters = useMemo(() => {
    const c: Record<string, number> = {};
    messages.filter(m => m.type === "members").forEach(m => { const n = Object.keys(m.data.members || {}).length; c[m.cluster] = Math.max(c[m.cluster] || 0, n); });
    return c;
  }, [messages]);
  return (
    <div className="hive-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Realtime Swarm</h2>
        <div className={`flex items-center gap-1.5 text-xs ${connected ? "text-green-400" : "text-red-400"}`}>{connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}{connected ? "LIVE" : "OFFLINE"}</div>
      </div>
      {metrics ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center"><div className="text-2xl font-bold text-hive-accent">{metrics.alive}</div><div className="text-[10px] text-gray-500 uppercase">Alive</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-hive-purple">{metrics.inferences}</div><div className="text-[10px] text-gray-500 uppercase">Inferences</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-hive-orange">{metrics.anchors}</div><div className="text-[10px] text-gray-500 uppercase">Anchors</div></div>
        </div>
      ) : <div className="text-center text-gray-500 text-sm py-4">Waiting for data...</div>}
      <div className="mt-3 flex flex-wrap gap-2">{Object.entries(clusters).map(([k, v]) => <span key={k} className="text-[10px] px-2 py-1 rounded bg-gray-900 text-gray-400">{k}: {v} cells</span>)}</div>
      <div className="mt-3 flex items-center gap-2"><Activity className="w-3 h-3 text-hive-accent animate-pulse" /><div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-hive-accent to-hive-blue transition-all" style={{ width: `${Math.min((messages.length / 50) * 100, 100)}%` }} /></div><span className="text-[10px] text-gray-500">{messages.length} events</span></div>
    </div>
  );
}