"use client";
import { useEffect, useRef, useState, useCallback } from "react";
export function useHiveWebSocket(channels: string[] = ["metrics", "members", "logs"]) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef(0);
  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => { setConnected(true); reconnectRef.current = 0; ws.send(JSON.stringify({ type: "subscribe", channels })); };
    ws.onmessage = (e) => { try { const msg = JSON.parse(e.data); setMessages(prev => [msg, ...prev].slice(0, 100)); } catch {} };
    ws.onclose = () => { setConnected(false); const delay = Math.min(1000 * Math.pow(2, reconnectRef.current++), 30000); setTimeout(connect, delay); };
    ws.onerror = () => ws.close();
    wsRef.current = ws;
  }, [channels]);
  useEffect(() => { connect(); return () => wsRef.current?.close(); }, [connect]);
  return { connected, messages };
}