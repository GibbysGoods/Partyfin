export type JellyfinAuth = { userId: string; accessToken: string };
export type PartyTrack = { id: string; name: string; artist?: string; album?: string; duration?: number };
export type PartyState = { queue: PartyTrack[]; currentIndex: number; isPlaying: boolean; positionMs: number; lastUpdate: number };
