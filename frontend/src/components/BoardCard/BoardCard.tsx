import { useNavigate } from "react-router-dom";
import { deleteBoard } from "../../api/api";
import { useDispatch } from "react-redux";
import { fetchBoards } from "../../features/boards/boardSlice";
import { useState } from "react";
import Modal from "../Modal";
import styles from "./BoardCard.module.css"

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
        className={styles.boardCard}
      >
        {/* delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={styles.deleteBtn}
        >
          ✕
        </button>

        <div className={styles.title}>
          {board.title}
        </div>
      </div>
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className={styles.modalTitle}>Удалить доску?</h3>

        <div className={styles.actions}>
          <button
            onClick={handleDelete}
            className="button button-primary"
          >
            Удалить
          </button>

          <button
            onClick={() => setIsModalOpen(false)}
            className="button"
          >
            Отмена
          </button>
        </div>
      </Modal>
    </>
  );
}