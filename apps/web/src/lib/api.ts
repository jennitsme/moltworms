const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchThreads() {
  const res = await fetch(`${API_URL}/threads`, { cache: "no-store" });
  if (!res.ok) throw new Error(`threads status ${res.status}`);
  return res.json();
}

export async function fetchMessages(threadId: string) {
  const res = await fetch(`${API_URL}/threads/${threadId}/messages`, { cache: "no-store" });
  if (!res.ok) throw new Error(`messages status ${res.status}`);
  return res.json();
}
