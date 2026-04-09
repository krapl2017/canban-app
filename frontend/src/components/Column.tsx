import {
  deleteColumn,
  updateColumn,
} from "../api/api";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Card from "./Card";
import SortableCard from "./SortableCard";

export default function Column({ column, onAddCard, refresh }: any) {
  const handleDeleteColumn = async () => {
    if (!confirm("Удалить колонку?")) return;

    await deleteColumn(column.id);
    refresh();
  };

  const handleEditColumn = async () => {
    const newTitle = prompt("Новое название колонки", column.title);
    if (!newTitle) return;

    await updateColumn(column.id, { title: newTitle });

    refresh();
  };

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: "#ebecf0",
        padding: 10,
        borderRadius: 8,
        width: 250,
        position: "relative",
      }}
    >
      <h3
        onClick={handleEditColumn}
        style={{ cursor: "pointer" }}
      >
        {column.title}
      </h3>

      <button
        onClick={handleDeleteColumn}
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

      <SortableContext
        items={column.cards.map((c: any) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.cards.map((card: any) => (
          <SortableCard key={card.id} id={card.id}>
            <Card
              card={card}
              columnId={column.id}
              refresh={refresh}
            />
          </SortableCard>
        ))}
      </SortableContext>

      <button onClick={() => onAddCard(column.id)}>
        + Добавить карточку
      </button>
    </div>
  );
}