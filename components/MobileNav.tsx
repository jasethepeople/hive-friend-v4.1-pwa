"use client";
import { useState } from "react";
import { Menu, X, Activity, Globe, Cpu, Shield, Zap } from "lucide-react";
const NAV = [
  { icon: Activity, label: "Swarm", href: "/" },
  { icon: Globe, label: "Federation", href: "/federation" },
  { icon: Cpu, label: "GPU", href: "/gpu" },
  { icon: Shield, label: "Security", href: "/security" },
  { icon: Zap, label: "Chaos", href: "/chaos" },
];
export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-hive-panel/95 backdrop-blur border-b border-hive-border">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-bold text-hive-accent">HIVE</span>
          <button onClick={() => setOpen(!open)} className="p-2">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-hive-dark/95 backdrop-blur pt-16">
          <nav className="p-4 space-y-2">
            {NAV.map(item => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-hive-panel transition-colors">
                <item.icon className="w-5 h-5 text-hive-accent" /><span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-16 flex-col items-center py-6 bg-hive-panel border-r border-hive-border z-30">
        {NAV.map(item => (
          <a key={item.label} href={item.href} className="p-3 rounded-lg hover:bg-hive-accent/10 hover:text-hive-accent transition-colors mb-2" title={item.label}>
            <item.icon className="w-5 h-5" />
          </a>
        ))}
      </aside>
    </>
  );
}