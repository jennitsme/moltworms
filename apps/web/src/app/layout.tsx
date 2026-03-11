import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Moltworms",
  description: "Unified inbox + actionable agent layer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
          <header style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Moltworms</h1>
            <p style={{ color: "#555" }}>
              Unified inbox with agentic suggested actions and approval guardrails.
            </p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
