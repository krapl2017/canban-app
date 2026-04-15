import { useNavigate } from "react-router-dom";
import { deleteBoard } from "../../api/api";
import { useDispatch } from "react-redux";
import { fetchBoards } from "../../features/boards/boardSlice";
import { useState } from "react";
import Modal from "../Modal";

export default function BoardCard({ board }: any) {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    await deleteBoard(board.id);
    dispatch(fetchBoards(board.user_name));
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/boards/${board.id}`)}
        style={{
          background: "white",
          padding: 20,
          borderRadius: 16,
          width: 220,
          cursor: "pointer",
          position: "relative",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateY(-4px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 8px 20px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        {/* delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            color: "#999",
          }}
        >
          ✕
        </button>

        {/* title */}
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: "#333",
            wordBreak: "break-word",
          }}
        >
          {board.title}
        </div>
      </div>
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 style={{color: "black"}}>Удалить доску?</h3>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleDelete}
            style={{
              background: "#e76f51",
              color: "white",
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Удалить
          </button>

          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer",
              background: "white",
            }}
          >
            Отмена
          </button>
        </div>
      </Modal>
    </>
  );
}