import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, createColumn, createCard, updateCard } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoardById } from "../features/boards/boardSlice";
import type { RootState } from "../app/store";
import Column from "../components/Column";
import { DndContext } from "@dnd-kit/core";

export default function BoardPage() {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const board = useSelector((state: RootState) => state.boards.currentBoard);
  //const [board, setBoard] = useState<any>(null);
  const [columnTitle, setColumnTitle] = useState("");

  useEffect(() => {
    dispatch(fetchBoardById(id!));
  }, [id]);

  const handleCreateColumn = async () => {
    if (!columnTitle) return;

    await createColumn({
      title: columnTitle,
      board_id: Number(id),
    });

    setColumnTitle("");
    dispatch(fetchBoardById(id!));
  };

  const handleCreateCard = async (columnId: number) => {
    const title = prompt("Название карточки");
    if (!title) return;

    await createCard({
      title,
      column_id: columnId,
    });

    dispatch(fetchBoardById(id!));
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    // если бросили вне колонки
    if (!over) return;

    const cardId = Number(active.id);
    const newColumnId = Number(over.id);

    // если кинули в ту же колонку — ничего не делаем
    if (!cardId || !newColumnId) return;

    await updateCard(cardId, {
      column_id: newColumnId,
    });

    dispatch(fetchBoardById(id!));
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
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 20 }}>
          {board.columns.map((col: any) => (
            <Column
              key={col.id}
              column={col}
              onAddCard={handleCreateCard}
              refresh={()=>dispatch(fetchBoardById(id!))}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}