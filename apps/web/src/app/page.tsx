export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.75rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Status</h2>
        <p style={{ color: "#444" }}>API health: connect to /health</p>
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
