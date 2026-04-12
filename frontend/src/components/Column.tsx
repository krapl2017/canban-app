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
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const addRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const editRef = useRef<HTMLDivElement | null>(null);

  const handleDeleteColumn = async () => {
    await deleteColumn(column.id);
    setIsDeleteOpen(false);
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

  const handleSaveTitle = async () => {
    const trimmed = editTitle.trim();

    if (!trimmed) {
      setEditTitle(column.title); // откат
      setIsEditing(false);
      return;
    }

    if (trimmed !== column.title) {
      await updateColumn(column.id, { title: trimmed });
      refresh();
    }

    setIsEditing(false);
  };

  {/** клики вне редактирования названия колонки */}
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!editRef.current) return;

      if (!editRef.current.contains(e.target as Node)) {
        handleSaveTitle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editTitle]);  

  return (
    <div
      ref={setNodeRef}
      style={{
        background: "#fdf6f0",
        padding: 12,
        borderRadius: 16,
        width: 260,
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/** название колонки */}
      <div
        ref={editRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            onFocus={(e) => e.target.select()}
            style={{
              width: "100%",
              fontSize: 16,
              fontWeight: "bold",
              padding: 6,
              borderRadius: 8,
              border: "1px solid #ddd",
              outline: "none",
              background: "#fff",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTitle();
              if (e.key === "Escape") {
                setEditTitle(column.title);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <h3
            onClick={() => {
              setEditTitle(column.title);
              setIsEditing(true);
            }}
            style={{
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
            }}
          >
            {column.title}
          </h3>
        )}
      </div>
      {/** удаление колонки */}
      <button
        onClick={() => setIsDeleteOpen(true)}
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          marginLeft: 8,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 16,
          color: "#c96",
        }}
      >
        ✕
      </button>

      {/** блок перетаскивания - фактическое содержимое колонки */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
      </div>

      {/** добавление карточки */}
      {isAdding ? (
        <div
          ref={addRef}
          style={{
            marginTop: 10,
            background: "#fff",
            padding: 8,
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название карточки"
            autoFocus
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 6,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={handleAdd}
              style={{
                background: "#f4a261",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Добавить
            </button>

            <button
              onClick={() => setIsAdding(false)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          style={{
            marginTop: 10,
            background: "transparent",
            border: "none",
            color: "#a67c52",
            cursor: "pointer",
            textAlign: "left",
            padding: "6px 4px",
            borderRadius: 8,
          }}
        >
          + Добавить карточку
        </button>
      )}

      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <h3>Удалить колонку?</h3>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleDeleteColumn}
            style={{
              background: "#e76f51",
              color: "white",
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
            }}
          >
            Удалить
          </button>

          <button
            onClick={() => setIsDeleteOpen(false)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer",
              background: "white",
            }}
          >
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}