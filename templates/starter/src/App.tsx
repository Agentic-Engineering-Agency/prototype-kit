/**
 * prototype-kit starter
 *
 * Replace this file with your actual routes once you've run /prototype-from-docs.
 * The agent will generate src/routes/ and wire them here.
 */

export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
      >
        prototype-kit starter
      </h1>
      <p
        style={{
          color: "var(--muted-foreground)",
          maxWidth: "40ch",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        Run <code>/prototype-from-docs</code> inside your agent to scaffold
        your product's screens into this starter.
      </p>
    </main>
  );
}
