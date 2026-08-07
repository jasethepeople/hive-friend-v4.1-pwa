"use client";
import { useState } from "react";
import { Zap, Globe, Link2, Bomb, Cpu, ChevronUp } from "lucide-react";
import { useHaptics } from "@/lib/haptics";
export function ControlPanel() {
  const [inferring, setInferring] = useState(false);
  const [chaos, setChaos] = useState(false);
  const [sheet, setSheet] = useState(false);
  const h = useHaptics();
  const runInfer = () => { h.medium(); setInferring(true); setTimeout(() => { setInferring(false); h.success(); }, 2000); };
  const runChaos = () => { h.heavy(); setChaos(true); setTimeout(() => { setChaos(false); h.success(); }, 5000); };
  return (
    <>
      <div className="hidden md:block hive-panel p-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Swarm Control</h2>
        <div className="grid grid-cols-2 gap-3">
          <Btn icon={Cpu} label={inferring ? "Inferring..." : "GPU Inference"} onClick={runInfer} loading={inferring} v="primary" />
          <Btn icon={Bomb} label={chaos ? "CHAOS ACTIVE" : "Inject Chaos"} onClick={runChaos} loading={chaos} v="danger" />
          <Btn icon={Globe} label="Federation" onClick={() => h.light()} />
          <Btn icon={Link2} label="Anchor Now" onClick={() => h.light()} />
          <Btn icon={Zap} label="Scale +5" onClick={() => h.light()} className="col-span-2" />
        </div>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <button onClick={() => { setSheet(!sheet); h.light(); }} className="w-full bg-hive-panel border-t border-hive-border p-3 flex items-center justify-center gap-2">
          <ChevronUp className={`w-5 h-5 transition-transform ${sheet ? "rotate-180" : ""}`} /><span className="text-sm font-bold">Swarm Controls</span>
        </button>
        {sheet && (
          <div className="bottom-sheet">
            <div className="grid grid-cols-2 gap-3">
              <Btn icon={Cpu} label="GPU" onClick={() => { runInfer(); setSheet(false); }} v="primary" />
              <Btn icon={Bomb} label="Chaos" onClick={() => { runChaos(); setSheet(false); }} v="danger" />
              <Btn icon={Globe} label="Fed" onClick={() => setSheet(false)} />
              <Btn icon={Link2} label="Anchor" onClick={() => setSheet(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
function Btn({ icon: Icon, label, onClick, loading, v, className }: any) {
  const base = "hive-btn flex items-center justify-center gap-2 py-3 touch-card";
  const variants: any = { default: "", primary: "hive-btn-primary", danger: "hive-btn-danger" };
  return <button onClick={onClick} disabled={loading} className={`${base} ${variants[v || "default"]} ${className || ""} ${loading ? "animate-pulse" : ""}`}><Icon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /><span className="text-xs">{label}</span></button>;
}