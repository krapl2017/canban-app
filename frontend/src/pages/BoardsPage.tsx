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
    <div style={{ padding: 20 }}>
      <h1>Мои доски</h1>

      {/* пользователь */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Введите имя пользователя"
        />
      </div>

      {/* создание доски */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая доска"
        />
        <button onClick={handleCreate}>Создать</button>
      </div>

      {/* список досок */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {boards.map((b) => (
          <BoardCard key={b.id} board={b} />
        ))}
      </div>
    </div>
  );
}