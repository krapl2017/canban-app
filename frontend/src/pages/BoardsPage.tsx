import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards, createBoard } from "../features/boards/boardSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";

export default function BoardsPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { boards } = useSelector((state: RootState) => state.boards);

  const [userName, setUserName] = useState("ivan");
  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchBoards(userName));
  }, []);

  const handleCreate = () => {
    dispatch(createBoard({ title, user_name: userName }));
    setTitle("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Boards</h1>

      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="User name"
      />

      <br /><br />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New board"
      />
      <button onClick={handleCreate}>Create</button>

      <ul>
        {boards.map((b) => (
          <li key={b.id}>
            <button onClick={() => navigate(`/boards/${b.id}`)}>
              {b.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}