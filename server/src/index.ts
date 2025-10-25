import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { login, searchMusic, streamUrl, getRecommended } from "./jellyfin.js";
import { PartyRoom } from "./partySync.js";

const JELLYFIN_URL = process.env.JELLYFIN_URL;
if (!JELLYFIN_URL) throw new Error("JELLYFIN_URL is required");

const app = express();
app.use(cors());
app.use(express.json());

// Static frontend
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body as { username: string; password: string };
    const { userId, accessToken } = await login(username, password);
    res.json({ userId, accessToken, jellyfinUrl: JELLYFIN_URL });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
});

app.get("/api/recommend", async (req, res) => {
  const { userId, token } = req.query as any;
  const items = await getRecommended({ userId, token });
  res.json(items);
});

app.get("/api/search", async (req, res) => {
  const { q, userId, token } = req.query as any;
  const items = await searchMusic(q || "", { userId, token });
  res.json(items);
});

app.get("/api/stream/:id", (req, res) => {
  const { token } = req.query as any;
  const url = streamUrl(req.params.id, token);
  res.json({ url });
});

// Party sync via Socket.IO
const http = createServer(app);
const io = new Server(http, { cors: { origin: true } });
const rooms = new Map<string, PartyRoom>();

io.on("connection", (socket) => {
  let roomId: string | null = null;

  socket.on("join", (id: string) => {
    roomId = id; socket.join(id);
    if (!rooms.has(id)) rooms.set(id, new PartyRoom());
    socket.emit("state", rooms.get(id)!.state);
    socket.to(id).emit("presence", { joined: socket.id });
  });

  socket.on("enqueue", (track) => { if (!roomId) return; const r = rooms.get(roomId)!; r.enqueue(track); io.to(roomId).emit("state", r.state); });
  socket.on("control", (cmd) => {
    if (!roomId) return;
    const r = rooms.get(roomId)!;
    const { type, payload } = cmd;
    switch (type) {
      case "play": r.play(payload?.index); break;
      case "pause": r.pause(); break;
      case "seek": r.seek(payload?.ms ?? 0); break;
      case "next": r.next(); break;
      case "prev": r.prev(); break;
    }
    io.to(roomId).emit("state", r.state);
  });

  socket.on("disconnect", () => { if (roomId) socket.to(roomId).emit("presence", { left: socket.id }); });
});

const PORT = Number(process.env.PORT || 8080);
http.listen(PORT, () => console.log(`Partyfin listening on :${PORT}`));
