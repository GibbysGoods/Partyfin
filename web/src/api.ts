const base = "";
export type Auth = { userId: string; accessToken: string; jellyfinUrl: string };

export async function login(username: string, password: string): Promise<Auth> {
  const r = await fetch(`/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
  if (!r.ok) throw new Error("Login failed");
  return r.json();
}

export async function search(q: string, auth: Auth) {
  const u = new URL(`/api/search`, location.origin);
  u.searchParams.set("q", q);
  u.searchParams.set("userId", auth.userId);
  u.searchParams.set("token", auth.accessToken);
  const r = await fetch(u);
  return r.json();
}

export async function getStreamUrl(itemId: string, auth: Auth) {
  const u = new URL(`/api/stream/${itemId}`, location.origin);
  u.searchParams.set("token", auth.accessToken);
  const r = await fetch(u);
  const { url } = await r.json();
  return url as string;
}
