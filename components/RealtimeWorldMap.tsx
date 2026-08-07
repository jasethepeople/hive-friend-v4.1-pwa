"use client";
import { useHiveWebSocket } from "@/lib/websocket";
import { useMemo } from "react";
const REGIONS: any = { "us-east": { name: "US-East", x: 20, y: 30, color: "#00d9a3" }, "eu-west": { name: "EU-West", x: 48, y: 25, color: "#3498db" }, "ap-south": { name: "AP-South", x: 75, y: 50, color: "#9b59b6" } };
export function RealtimeWorldMap() {
  const { connected, messages } = useHiveWebSocket(["members", "metrics"]);
  const data = useMemo(() => {
    const d: any = {};
    messages.filter(m => m.type === "members").forEach(m => { const c = m.cluster; const n = Object.keys(m.data.members || {}).length; const a = Object.values(m.data.members || {}).filter((x: any) => x.status === "alive").length; if (!d[c]) d[c] = { cells: 0, alive: 0, load: 0 }; d[c].cells = Math.max(d[c].cells, n); d[c].alive = Math.max(d[c].alive, a); });
    messages.filter(m => m.type === "metrics").forEach(m => { const c = m.cluster; if (!d[c]) d[c] = { cells: 0, alive: 0, load: 0 }; d[c].load = Math.random() * 100; });
    return d;
  }, [messages]);
  return (
    <div className="hive-panel p-6 min-h-[320px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Live Topology</h2>
        <div className={`flex items-center gap-1.5 text-xs ${connected ? "text-green-400" : "text-red-400"}`}><span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />{connected ? "STREAMING" : "OFFLINE"}</div>
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="us-eu" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#00d9a3" /><stop offset="100%" stopColor="#3498db" /></linearGradient>
          <linearGradient id="eu-ap" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3498db" /><stop offset="100%" stopColor="#9b59b6" /></linearGradient>
        </defs>
        <line x1="25%" y1="35%" x2="52%" y2="30%" stroke="url(#us-eu)" strokeWidth="2" opacity="0.2" strokeDasharray="4,4"><animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" /></line>
        <line x1="52%" y1="30%" x2="78%" y2="55%" stroke="url(#eu-ap)" strokeWidth="2" opacity="0.2" strokeDasharray="4,4"><animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" /></line>
      </svg>
      {Object.entries(REGIONS).map(([key, region]: [string, any]) => {
        const rd = data[key] || { cells: 0, alive: 0, load: 0 };
        const size = Math.max(60, 40 + rd.cells * 12);
        return (
          <div key={key} className="absolute rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 cursor-pointer hover:scale-110"
            style={{ left: `${region.x}%`, top: `${region.y}%`, width: size, height: size, transform: "translate(-50%, -50%)", backgroundColor: `${region.color}15`, borderColor: region.color, color: region.color, boxShadow: `0 0 ${20 + (rd.load / 100) * 30}px ${region.color}30` }}>
            <span className="text-xs font-bold">{region.name}</span>
            <span className="text-[10px] opacity-80">{rd.alive}/{rd.cells} cells</span>
            {rd.load > 0 && <span className="text-[9px] mt-0.5 opacity-60">Load: {rd.load.toFixed(0)}%</span>}
          </div>
        );
      })}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-hive-accent rounded-full animate-ping" style={{ left: `${20 + i * 15}%`, top: `${30 + Math.sin(i) * 20}%`, animationDelay: `${i * 0.5}s`, animationDuration: "3s" }} />)}
      </div>
    </div>
  );
}