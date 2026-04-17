import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards, createBoard } from "../../features/boards/boardSlice";
import type { RootState } from "../../app/store";
import BoardCard from "../../components/BoardCard/BoardCard";
import styles from "./BoardsPage.module.css";

export default function BoardsPage() {
  const dispatch = useDispatch<any>();
  const { boards } = useSelector((state: RootState) => state.boards);

  const [userName, setUserName] = useState(
    localStorage.getItem("user") || ""
  );
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (userName) {
      dispatch(fetchBoards(userName));
      localStorage.setItem("user", userName);
    }
  }, [userName]);

  const handleCreate = () => {
    if (!title) return;

    dispatch(createBoard({ title, user_name: userName }));
    setTitle("");
  };

  return (
    <div className={styles.page}>
      {/* USER */}
      <div className={styles.userBlock}>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Введите имя пользователя"
          className={styles.userInput}
        />
      </div>

      {/* TITLE */}
      <h1 className={styles.title}>
        Мои доски
      </h1>

      {/* CREATE BOARD */}
      <div className={styles.createBlock}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая доска"
          className={styles.input}
        />

        <button
          onClick={handleCreate}
          className={styles.createButton}
        >
          Создать
        </button>
      </div>

      {/* BOARDS LIST */}
      <div className={styles.boardsList}>
        {boards.map((b) => (
          <BoardCard key={b.id} board={b} />
        ))}
      </div>
    </div>
  );
}