import { useNavigate } from "react-router-dom";

export default function BoardCard({ board }: any) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/boards/${board.id}`)}
      style={{
        background: "#0079bf",
        color: "white",
        padding: 20,
        borderRadius: 8,
        width: 200,
        cursor: "pointer",
      }}
    >
      {board.title}
    </div>
  );
}