import { useNavigate } from "react-router-dom";
import { deleteBoard } from "../api/api";
import { useDispatch } from "react-redux";
import { fetchBoards } from "../features/boards/boardSlice";
import { useState } from "react";
import Modal from "./Modal";

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
      {/* кнопка удаления */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
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
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 style={{color: "black"}}>Удалить доску?</h3>

        <p style={{ marginTop: 10, color: "black" }}>
          Это действие нельзя отменить
        </p>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleDelete}
            style={{
              background: "red",
              color: "white",
              padding: "6px 12px",
            }}
          >
            Удалить
          </button>

          <button onClick={() => setIsModalOpen(false)}>
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}