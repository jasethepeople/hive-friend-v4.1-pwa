"use client";
import { Activity } from "lucide-react";
export function Header() {
  return (
    <header className="bg-gradient-to-r from-hive-accent/20 via-hive-blue/20 to-hive-purple/20 border-b border-hive-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="w-5 h-5 text-hive-accent animate-pulse" />
            <div className="absolute inset-0 w-5 h-5 bg-hive-accent/30 rounded-full animate-ping" />
          </div>
          <h1 className="text-lg font-bold tracking-wider text-white">HIVE <span className="text-hive-accent">FRIEND</span></h1>
        </div>
        <span className="px-2 py-0.5 rounded bg-hive-accent/10 text-hive-accent border border-hive-accent/30 text-xs">LIVE</span>
      </div>
    </header>
  );
}