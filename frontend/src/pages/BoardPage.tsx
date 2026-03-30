import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, createColumn, createCard } from "../api/api";

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

  // ➕ создать колонку
  const handleCreateColumn = async () => {
    if (!columnTitle) return;

    await createColumn({
      title: columnTitle,
      board_id: Number(id),
    });

    setColumnTitle("");
    fetchBoard();
  };

  // ➕ создать карточку
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

      {/* ➕ создание колонки */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
          placeholder="Новая колонка"
        />
        <button onClick={handleCreateColumn}>Добавить колонку</button>
      </div>

      {/* 📦 колонки */}
      <div style={{ display: "flex", gap: 20 }}>
        {board.columns.map((col: any) => (
          <div
            key={col.id}
            style={{
              background: "#f4f4f4",
              padding: 10,
              width: 250,
              borderRadius: 8,
            }}
          >
            <h3>{col.title}</h3>

            {/* 📋 карточки */}
            {col.cards.map((card: any) => (
              <div
                key={card.id}
                style={{
                  background: "white",
                  padding: 8,
                  marginBottom: 8,
                  borderRadius: 4,
                }}
              >
                {card.title}
              </div>
            ))}

            {/* ➕ карточка */}
            <button onClick={() => handleCreateCard(col.id)}>
              + Добавить карточку
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}