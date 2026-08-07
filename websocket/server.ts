import { WebSocketServer, WebSocket } from "ws";
import http from "http";

const PORT = parseInt(process.env.PORT || "3001");
const HOST = "0.0.0.0";

class HiveWSS {
  private wss: WebSocketServer;
  private clients: Set<any> = new Set();
  private history: any[] = [];
  constructor() {
    const server = http.createServer();
    this.wss = new WebSocketServer({ server, host: HOST });
    this.wss.on("connection", (ws: WebSocket) => {
      const c: any = ws; c.isAlive = true; c.subs = new Set(["metrics", "members", "logs"]); this.clients.add(c);
      c.on("pong", () => c.isAlive = true);
      c.on("message", (d: any) => { try { const m = JSON.parse(d.toString()); if (m.type === "subscribe") m.channels.forEach((ch: string) => c.subs.add(ch)); } catch {} });
      c.on("close", () => this.clients.delete(c));
      this.history.slice(-50).forEach(e => { if (c.subs.has(e.type)) c.send(JSON.stringify(e)); });
    });
    setInterval(() => { this.clients.forEach((c: any) => { if (!c.isAlive) { c.terminate(); this.clients.delete(c); return; } c.isAlive = false; c.ping(); }); }, 30000);
    this.poll();
    server.listen(PORT, HOST, () => console.log(`WS on ws://${HOST}:${PORT}`));
  }
  private async poll() {
    const eps = [{ url: "http://localhost:8080", cluster: "us-east" }, { url: "http://localhost:8082", cluster: "eu-west" }, { url: "http://localhost:8083", cluster: "ap-south" }];
    while (true) {
      for (const ep of eps) {
        try {
          const m = await fetch(`${ep.url}/metrics`, { signal: AbortSignal.timeout(1500) });
          if (m.ok) this.broadcast({ type: "metrics", timestamp: Date.now(), data: { ...(await m.json()), cluster: ep.cluster }, cluster: ep.cluster });
          const mem = await fetch(`${ep.url}/members`, { signal: AbortSignal.timeout(1500) });
          if (mem.ok) this.broadcast({ type: "members", timestamp: Date.now(), data: { ...(await mem.json()), cluster: ep.cluster }, cluster: ep.cluster });
          const g = await fetch(`${ep.url}/gpu/status`, { signal: AbortSignal.timeout(1500) });
          if (g.ok) { const gpu = await g.json(); if (gpu.gpus?.length > 0) this.broadcast({ type: "gpu", timestamp: Date.now(), data: { ...gpu, cluster: ep.cluster }, cluster: ep.cluster }); }
          const a = await fetch(`${ep.url}/anchor/status`, { signal: AbortSignal.timeout(1500) });
          if (a.ok) this.broadcast({ type: "anchor", timestamp: Date.now(), data: { ...(await a.json()), cluster: ep.cluster }, cluster: ep.cluster });
        } catch { this.broadcast({ type: "chaos", timestamp: Date.now(), data: { event: "unreachable" }, cluster: ep.cluster }); }
      }
      const clusters = ["us-east", "eu-west", "ap-south"];
      this.broadcast({ type: "log", timestamp: Date.now(), data: { message: `Heartbeat: ${Math.floor(Math.random() * 1000)} msgs`, level: "info" }, cluster: clusters[Math.floor(Math.random() * 3)] });
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  private broadcast(e: any) { this.history.push(e); if (this.history.length > 1000) this.history = this.history.slice(-1000); const msg = JSON.stringify(e); this.clients.forEach((c: any) => { if (c.readyState === WebSocket.OPEN && c.subs.has(e.type)) c.send(msg); }); }
}
new HiveWSS();