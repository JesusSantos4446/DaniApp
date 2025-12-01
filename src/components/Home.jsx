export default function Home({ onSelectApp, user }) {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      {user && <h1>Bienvenido, {user.name}</h1>}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "30px",
          alignItems: "center",
        }}
      >
        <button onClick={() => onSelectApp("clima")}>Clima</button>
        <button onClick={() => window.open("/apps/app1/index.html", "_blank")}>
          App 2
        </button>
        <button onClick={() => onSelectApp("app3")}>App 3</button>
        <button onClick={() => onSelectApp("app4")}>App 4</button>
      </div>
    </div>
  );
}
