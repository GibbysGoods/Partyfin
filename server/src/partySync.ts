import type { PartyState, PartyTrack } from "./types.js";

export class PartyRoom {
  state: PartyState = { queue: [], currentIndex: 0, isPlaying: false, positionMs: 0, lastUpdate: Date.now() };

  enqueue(track: PartyTrack) { this.state.queue.push(track); }
  setQueue(q: PartyTrack[]) { this.state.queue = q; this.state.currentIndex = 0; this.seek(0); }
  play(i?: number) { if (typeof i === "number") this.state.currentIndex = i; this.state.isPlaying = true; this.state.lastUpdate = Date.now(); }
  pause() { this.state.isPlaying = false; this.state.positionMs = this.positionNow(); }
  seek(ms: number) { this.state.positionMs = ms; this.state.lastUpdate = Date.now(); }
  next() { if (this.state.currentIndex < this.state.queue.length - 1) { this.state.currentIndex++; this.seek(0); } }
  prev() { if (this.state.currentIndex > 0) { this.state.currentIndex--; this.seek(0); } }
  positionNow() { if (!this.state.isPlaying) return this.state.positionMs; const dt = Date.now() - this.state.lastUpdate; return this.state.positionMs + dt; }
}
