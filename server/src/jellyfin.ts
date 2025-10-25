import fetch from "node-fetch";

const jfHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  "X-Emby-Authorization": `MediaBrowser Client=Partyfin, Device=Browser, DeviceId=partyfin-web, Version=1.0.0`,
  ...(token ? { "X-Emby-Token": token } : {})
});

const base = process.env.JELLYFIN_URL!; // validated on boot

export async function login(username: string, password: string) {
  const r = await fetch(`${base}/Users/AuthenticateByName`, {
    method: "POST",
    headers: jfHeaders(),
    body: JSON.stringify({ Username: username, Pw: password })
  });
  if (!r.ok) throw new Error(`Auth failed: ${r.status}`);
  const data = await r.json();
  return { userId: data?.User?.Id as string, accessToken: data?.AccessToken as string };
}

export function streamUrl(itemId: string, token: string) {
  const u = new URL(`${base}/Audio/${itemId}/universal`);
  u.searchParams.set("static", "true");
  // Optional: add transcoding params like maxStreamingBitrate if desired
  return `${u.toString()}&X-Emby-Token=${encodeURIComponent(token)}`;
}

export async function searchMusic(q: string, auth: { userId: string; token: string }) {
  const url = new URL(`${base}/Users/${auth.userId}/Items`);
  url.searchParams.set("Recursive", "true");
  url.searchParams.set("IncludeItemTypes", "Audio");
  url.searchParams.set("SearchTerm", q);
  url.searchParams.set("Limit", "50");
  const r = await fetch(url, { headers: jfHeaders(auth.token) });
  if (!r.ok) throw new Error(`Search failed: ${r.status}`);
  const data = await r.json();
  return (data?.Items ?? []).map((it: any) => ({
    id: it.Id,
    name: it.Name,
    artist: it?.AlbumArtist ?? it?.Artists?.[0],
    album: it?.Album,
    duration: it?.RunTimeTicks ? Math.floor(it.RunTimeTicks / 10000) : undefined
  }));
}

export async function getRecommended(auth: { userId: string; token: string }) {
  const url = new URL(`${base}/Users/${auth.userId}/Items`);
  url.searchParams.set("Recursive", "true");
  url.searchParams.set("IncludeItemTypes", "Audio");
  url.searchParams.set("SortBy", "Random");
  url.searchParams.set("Limit", "25");
  const r = await fetch(url, { headers: jfHeaders(auth.token) });
  const data = await r.json();
  return (data?.Items ?? []).map((it: any) => ({ id: it.Id, name: it.Name }));
}
