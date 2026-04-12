import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4a261",
        color: "white",
        fontWeight: 600,
        fontSize: 18,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
      onClick={() => navigate("/")}
    >
      HOME
    </div>
  );
}