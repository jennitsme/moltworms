import { fetchThreads, fetchMessages } from "../lib/api";

async function getHealth() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${apiUrl}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    return { ok: true, json } as const;
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "unknown" } as const;
  }
}

export default async function HomePage() {
  const [health, threads] = await Promise.all([getHealth(), fetchThreads()]);
  const firstThread = threads[0];
  const messages = firstThread ? await fetchMessages(firstThread.id) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.75rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Status</h2>
        {health.ok ? (
          <p style={{ color: "#065f46" }}>API health: {JSON.stringify(health.json)}</p>
        ) : (
          <p style={{ color: "#b91c1c" }}>API health check failed: {health.error}</p>
        )}
        <p style={{ color: "#444" }}>tRPC endpoint: /trpc</p>
      </div>

      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.75rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Threads</h3>
        {threads.length === 0 ? (
          <p style={{ color: "#444" }}>Belum ada thread.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {threads.map((t: any) => (
              <li key={t.id} style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <div style={{ fontWeight: 600 }}>{t.subject || "(no subject)"}</div>
                <div style={{ color: "#555" }}>{t.channel?.type} — {t.status}</div>
                <div style={{ color: "#777", fontSize: "0.9rem" }}>Last updated: {new Date(t.updatedAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.75rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Messages (first thread)</h3>
        {firstThread ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {messages.map((m: any) => (
              <li key={m.id} style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <div style={{ fontWeight: 600 }}>{m.author || "(unknown)"} — {m.direction}</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                <div style={{ color: "#777", fontSize: "0.9rem" }}>{new Date(m.occurredAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#444" }}>Pilih thread untuk melihat pesan.</p>
        )}
      </div>
    </div>
  );
}
