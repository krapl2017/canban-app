import { useNavigate } from "react-router-dom";
import { deleteBoard } from "../api/api";

export default function BoardCard({ board }: any) {
  const navigate = useNavigate();

  const handleDelete = async (e: any) => {
    e.stopPropagation(); // чтобы не срабатывал переход

    if (!confirm("Удалить доску?")) return;

    await deleteBoard(board.id);

    window.location.reload(); // пока просто
  };

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
        position: "relative",
      }}
    >
      {/* ❌ кнопка удаления */}
      <button
        onClick={handleDelete}
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          background: "red",
          color: "white",
        }}
      >
        X
      </button>

      {board.title}
    </div>
  );
}