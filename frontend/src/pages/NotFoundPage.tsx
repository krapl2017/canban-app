import { useNavigate } from "react-router-dom";
export default function NotFoundPage() {
    const navigate = useNavigate();
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#333",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: 80,
          margin: 0,
          color: "#f4a261",
        }}
      >
        404
      </h1>

      <h2 style={{ margin: "10px 0" }}>
        Страница не найдена
      </h2>

      <p style={{ color: "#777", marginBottom: 20 }}>
        Похоже, такой страницы не существует
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          background: "#f4a261",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        На главную
      </button>
    </div>
  );
}