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
import { useState } from "react";
import Modal from "./Modal";
import { useRef, useEffect } from "react";

export default function Column({ column, onAddCard, refresh, setGlobalModalOpen }: any) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const addRef = useRef<HTMLDivElement | null>(null);

  const handleDeleteColumn = async () => {
    await deleteColumn(column.id);
    setIsDeleteOpen(false);
    refresh();
  };

  const handleEditColumn = async () => {
    if (!newTitle) return;

    await updateColumn(column.id, { title: newTitle });
    setIsEditOpen(false);
    refresh();
  };

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleAdd = async () => {
    if (!title.trim()) return;

    await onAddCard(column.id, title);

    setTitle("");
    setIsAdding(false);
  };

  useEffect(() => {
    if (!isAdding) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!addRef.current) return;

      if (!addRef.current.contains(e.target as Node)) {
        // клик вне блока
        if (title.trim()) {
          handleAdd();
        } else {
          setIsAdding(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding, title]);

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
      {/** колонка и кнопка удаления*/}
      <h3
        onClick={() => {
          setNewTitle(column.title);
          setIsEditOpen(true);
        }}
        style={{ cursor: "pointer" }}
      >
        {column.title}
      </h3>
      <button
        onClick={() => setIsDeleteOpen(true)}
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

      {/** блок перетаскивания - фактическое содержимое колонки */}
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
              setGlobalModalOpen={setGlobalModalOpen}
            />
          </SortableCard>
        ))}
      </SortableContext>

        {/** добавление карточки */}
      {isAdding ? (
        <div ref={addRef} style={{ marginTop: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название карточки"
            autoFocus
            style={{
              width: "100%",
              padding: 6,
              marginBottom: 5,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />

          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={handleAdd}
              style={{
                background: "#0079bf",
                color: "white",
                padding: "4px 8px",
              }}
            >
              Добавить
            </button>

            <button onClick={() => setIsAdding(false)}>
              X
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)}>
          + Добавить карточку
        </button>
      )}

      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <h3>Удалить колонку?</h3>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleDeleteColumn}
            style={{
              background: "red",
              color: "white",
              padding: "6px 12px",
            }}
          >
            Удалить
          </button>

          <button onClick={() => setIsDeleteOpen(false)}>
            Отмена
          </button>
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <h3>Редактировать колонку</h3>

        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 6,
          }}
        />

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleEditColumn}
            style={{
              background: "#0079bf",
              color: "white",
              padding: "6px 12px",
            }}
          >
            Сохранить
          </button>

          <button onClick={() => setIsEditOpen(false)}>
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}