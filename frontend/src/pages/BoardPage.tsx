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

  if (!over) return;

  const activeId = Number(active.id);
  const overId = Number(over.id);

  // ищем колонку куда кинули
  let targetColumnId = overId;

  // если кинули на карточку — берем её колонку
  for (const col of board.columns) {
    if (col.cards.find((c: any) => c.id === overId)) {
      targetColumnId = col.id;
    }
  }

  await updateCard(activeId, {
    column_id: targetColumnId,
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