import {
  deleteColumn,
  updateColumn,
} from "../../api/api";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "../Card/Card";
import SortableCard from "../SortableCard";
import { useState } from "react";
import Modal from "../Modal";
import { useRef, useEffect } from "react";
import styles from "./Column.module.css"
import { updateColumnTitle } from "../../features/boards/boardSlice";
import { useDispatch } from "react-redux";

export default function Column({ column, onAddCard, refresh, setGlobalModalOpen }: any) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const addRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const editRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<any>();

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
      setEditTitle(column.title);
      setIsEditing(false);
      return;
    }

    if (trimmed === column.title) {
      setIsEditing(false);
      return;
    }

    const prevTitle = column.title;

    dispatch(updateColumnTitle({
      columnId: column.id,
      title: trimmed,
    }));

    setIsEditing(false);

    try {
      await updateColumn(column.id, { title: trimmed });
    } catch (e) {
      dispatch(updateColumnTitle({
        columnId: column.id,
        title: prevTitle,
      }));
      alert("Ошибка обновления");
    }
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
      className={styles.container}
      
    >
      {/** название колонки */}
      <div
        ref={editRef}
        className={styles.header}
      >
        {isEditing ? (
          <input
            className={styles.titleInput}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            onFocus={(e) => e.target.select()}
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
            className={styles.title}
            onClick={() => {
              setEditTitle(column.title);
              setIsEditing(true);
            }}
          >
            {column.title}
          </h3>
        )}
      </div>
      {/** удаление колонки */}
      <button
        onClick={() => setIsDeleteOpen(true)}
        className={styles.deleteBtn}
      >
        ✕
      </button>

      {/** блок перетаскивания - фактическое содержимое колонки */}
      <div className={styles.cardsWrapper}>
        <div className={styles.cards}>
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
      </div>

      {/** добавление карточки */}
      {isAdding ? (
        <div ref={addRef} className={styles.addBox}>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название карточки"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />

          <div className={styles.addActions}>
            <button
              onClick={handleAdd}
              className={styles.addBtn}
            >
              Добавить
            </button>

            <button
              onClick={() => setIsAdding(false)}
              className={styles.cancelBtn}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={styles.addTrigger}
        >
          + Добавить карточку
        </button>
      )}

      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <h3>Удалить колонку?</h3>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleDeleteColumn}
            className="button button-primary"
            style={{ background: "#e76f51" }}
          >
            Удалить
          </button>

          <button
            onClick={() => setIsDeleteOpen(false)}
            className="button"
          >
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}