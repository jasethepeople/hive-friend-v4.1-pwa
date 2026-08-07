"use client";
import { useEffect, useState } from "react";
const CC: any = { "us-east": "text-hive-accent", "eu-west": "text-hive-blue", "ap-south": "text-hive-purple" };
const TC: any = { info: "text-gray-400", gpu: "text-hive-purple", chain: "text-hive-orange", fed: "text-hive-blue", chaos: "text-hive-red", error: "text-red-400" };
const SAMPLES = [
  { message: "Cell discovered via beacon", type: "info" }, { message: "GPU inference: 45ms", type: "gpu" },
  { message: "Anchor: 0x7a3f...e9d2", type: "chain" }, { message: "Treaty sync acknowledged", type: "fed" },
  { message: "Raft consensus: index 12,847", type: "info" }, { message: "CHAOS: Latency injection", type: "chaos" }
];
export function LogStream() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    const iv = setInterval(() => {
      const cluster = ["us-east", "eu-west", "ap-south"][Math.floor(Math.random() * 3)];
      const s = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), cluster, message: s.message, type: s.type }, ...prev].slice(0, 50));
    }, 1500);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="hive-panel">
      <div className="px-6 py-4 border-b border-hive-border flex justify-between items-center">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Live Event Stream</h2>
        <div className="flex gap-2">{["us-east", "eu-west", "ap-south"].map(c => <span key={c} className={`text-[10px] px-2 py-0.5 rounded bg-gray-900 ${CC[c]}`}>{c}</span>)}</div>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 text-xs font-mono">
            <span className="text-gray-600 flex-shrink-0">[{log.time}]</span>
            <span className={`flex-shrink-0 ${CC[log.cluster] || "text-gray-500"}`}>{log.cluster}</span>
            <span className={TC[log.type]}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}