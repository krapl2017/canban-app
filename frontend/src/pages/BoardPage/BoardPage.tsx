import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createColumn, createCard, reorderCards, updateBoard } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoardById, setBoard, updateBoardState, replaceColumn } from "../../features/boards/boardSlice";
import type { RootState } from "../../app/store";
import Column from "../../components/Column/Column";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { useRef } from "react";
import styles from "./BoardPage.module.css"

export default function BoardPage() {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const board = useSelector((state: RootState) => state.boards.currentBoard);
  const [activeCard, setActiveCard] = useState<any>(null);
  const [columnTitle, setColumnTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false);
  const [editBoardTitle, setEditBoardTitle] = useState("");
  const titleRef = useRef<HTMLDivElement | null>(null);
  const inputColumnRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: isModalOpen ? 9999 : 5 },
    })
  );

  useEffect(() => {
    dispatch(fetchBoardById(id!));
  }, [id]);

  const handleCreateColumn = async () => {
    if (!columnTitle) return;

    const tempId = Date.now();

    const tempColumn = {
      id: tempId,
      title: columnTitle,
      cards: [],
    };

    dispatch(updateBoardState({
      columns: [...board.columns, tempColumn],
    }));

    setColumnTitle("");
    inputColumnRef.current?.focus();

    try {
      const response = await createColumn({
        title: columnTitle,
        board_id: Number(id),
      });

      const newCol = response.data;

      const normalizedColumn = {
        ...newCol,
        cards: [],
      };
      console.log(normalizedColumn);
      // замена temp на реальную
      dispatch(replaceColumn({
        tempId,
        newColumn: normalizedColumn,
      }));

    } catch (e) {
      dispatch(fetchBoardById(id!));
      alert("Ошибка создания колонки");
    }
  };

  const handleCreateCard = async (columnId: number, title: string) => {
    await createCard({
      title,
      column_id: columnId,
    });

    dispatch(fetchBoardById(id!));
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const id = Number(active.id);

    const card = board.columns
      .flatMap((col: any) => col.cards)
      .find((c: any) => c.id === id);

    setActiveCard(card);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || !board) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    let newColumns = JSON.parse(JSON.stringify(board.columns));

    let sourceCol: any;
    let targetCol: any;

    // найти колонки
    for (const col of newColumns) {
      if (col.cards.find((c: any) => c.id === activeId)) {
        sourceCol = col;
      }
      if (
        col.id === overId ||
        col.cards.find((c: any) => c.id === overId)
      ) {
        targetCol = col;
      }
    }

    if (!sourceCol || !targetCol) return;

    // вытащить карточку
    const movingCard = sourceCol.cards.find(
      (c: any) => c.id === activeId
    );

    sourceCol.cards = sourceCol.cards.filter(
      (c: any) => c.id !== activeId
    );

    // индекс вставки
    let overIndex = targetCol.cards.findIndex(
      (c: any) => c.id === overId
    );

    // если кидать не в карточку => кидать в конец
    if (overIndex === -1) {
      overIndex = targetCol.cards.length;
    }

    targetCol.cards.splice(overIndex, 0, {
      ...movingCard,
      column_id: targetCol.id,
    });

    // сформировать полный список
    const result: any[] = [];

    newColumns.forEach((col: any) => {
      col.cards.forEach((card: any, index: number) => {
        result.push({
          id: card.id,
          column_id: col.id,
          order: index,
        });
      });
    });

    const prevBoard = board;

    dispatch(setBoard({
      ...board,
      columns: newColumns,
    }));

    try {
      await reorderCards(result);
    } catch (e) {
      // откат
      dispatch(setBoard(prevBoard));
      alert("Ошибка сохранения");
    }
  };

  const handleSaveBoardTitle = async () => {
  const trimmed = editBoardTitle.trim();

  if (!trimmed) {
    setEditBoardTitle(board.title);
    setIsEditingBoardTitle(false);
    return;
  }

  const prevBoard = board;

  // мгновенно обновляем UI
  dispatch(setBoard({
    ...board,
    title: trimmed,
  }));

  setIsEditingBoardTitle(false);

  try {
    await updateBoard(board.id, { title: trimmed });
  } catch (e) {
    dispatch(setBoard(prevBoard));
    alert("Ошибка сохранения");
  }
};

  useEffect(() => {
    if (!isEditingBoardTitle) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!titleRef.current) return;

      if (!titleRef.current.contains(e.target as Node)) {
        handleSaveBoardTitle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingBoardTitle, editBoardTitle]);

  if (!board) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div ref={titleRef}>
          {isEditingBoardTitle ? (
            <input
              ref={inputColumnRef} 
              value={editBoardTitle}
              onChange={(e) => setEditBoardTitle(e.target.value)}
              autoFocus
              className={styles.titleInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveBoardTitle();
                if (e.key === "Escape") {
                  setEditBoardTitle(board.title);
                  setIsEditingBoardTitle(false);
                }
              }}
            />
          ) : (
            <div
              onClick={() => {
                setEditBoardTitle(board.title);
                setIsEditingBoardTitle(true);
              }}
              className={styles.titleBox}
            >
              {board.title}
            </div>
          )}
        </div>
      </div>

      {/* добавление колонки */}
      <div className={styles.createColumn}>
        <input
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
          placeholder="Новая колонка"
          className={styles.input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateColumn();
            }
          }}
        />

        <button
          onClick={handleCreateColumn}
          className={styles.button}
        >
          Добавить
        </button>
      </div>

      {/* колонки */}
      <div className={styles.columnsWrapper}>
        <div className={styles.columnsScroll}
        >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={(e) => {
                handleDragEnd(e);
                setActiveCard(null);
              }}
              onDragCancel={() => setActiveCard(null)}
              
            >
              <div className={styles.columns}>
                {board.columns.map((col: any) => (
                  <Column
                    key={col.id}
                    column={col}
                    onAddCard={handleCreateCard}
                    refresh={()=>dispatch(fetchBoardById(id!))}
                    setGlobalModalOpen={setIsModalOpen}
                  />
                ))}
              </div>
              <DragOverlay>
                {activeCard ? (
                  <div className={styles.dragOverlay}>
                    <div className={styles.dragTitle}>
                      {activeCard.title}
                    </div>

                    {activeCard.description && (
                      <div className={styles.dragDescription}>
                        {activeCard.description}
                      </div>
                    )}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
        </div>
      </div>
    </div>
  );
}