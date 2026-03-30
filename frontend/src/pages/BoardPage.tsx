import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, createColumn, createCard } from "../api/api";
import Column from "../components/Column";

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState<any>(null);
  const [columnTitle, setColumnTitle] = useState("");

  const fetchBoard = () => {
    api.get(`/boards/${id}`).then((res) => setBoard(res.data));
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const handleCreateColumn = async () => {
    if (!columnTitle) return;

    await createColumn({
      title: columnTitle,
      board_id: Number(id),
    });

    setColumnTitle("");
    fetchBoard();
  };

  const handleCreateCard = async (columnId: number) => {
    const title = prompt("Название карточки");
    if (!title) return;

    await createCard({
      title,
      column_id: columnId,
    });

    fetchBoard();
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{board.title}</h1>

      {/* добавление колонки */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
          placeholder="Новая колонка"
        />
        <button onClick={handleCreateColumn}>
          Добавить колонку
        </button>
      </div>

      {/* колонки */}
      <div style={{ display: "flex", gap: 20 }}>
        {board.columns.map((col: any) => (
          <Column
            key={col.id}
            column={col}
            onAddCard={handleCreateCard}
          />
        ))}
      </div>
    </div>
  );
}