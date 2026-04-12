import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards, createBoard } from "../features/boards/boardSlice";
import type { RootState } from "../app/store";
import BoardCard from "../components/BoardCard";

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
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f3ef",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* USER */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Введите имя пользователя"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            fontSize: 14,
            outline: "none",
            width: 220,
            textAlign: "center",
          }}
        />
      </div>

      {/* TITLE */}
      <h1
        style={{
          marginBottom: 20,
          fontWeight: 600,
          color: "#333",
        }}
      >
        Мои доски
      </h1>

      {/* CREATE BOARD */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 30,
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая доска"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            fontSize: 14,
            outline: "none",
            width: 200,
          }}
        />

        <button
          onClick={handleCreate}
          style={{
            background: "#f4a261",
            border: "none",
            color: "white",
            padding: "10px 16px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Создать
        </button>
      </div>

      {/* BOARDS LIST */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 1000,
        }}
      >
        {boards.map((b) => (
          <BoardCard key={b.id} board={b} />
        ))}
      </div>
    </div>
  );
}