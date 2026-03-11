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
  const health = await getHealth();

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
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Next Steps</h3>
        <ul style={{ color: "#444", lineHeight: 1.6 }}>
          <li>Wire API base URL via env; fetch healthcheck here.</li>
          <li>Add auth (OAuth) and channel connectors.</li>
          <li>Build inbox list and approval workflow UI.</li>
        </ul>
      </div>
    </div>
  );
}
