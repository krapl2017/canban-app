import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createColumn, createCard, reorderCards, updateBoard } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoardById, setBoard } from "../../features/boards/boardSlice";
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

export default function BoardPage() {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const board = useSelector((state: RootState) => state.boards.currentBoard);
  const [activeCard, setActiveCard] = useState<any>(null);
  const [columnTitle, setColumnTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const titleRef = useRef<HTMLDivElement | null>(null);

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

    await createColumn({
      title: columnTitle,
      board_id: Number(id),
    });

    setColumnTitle("");
    dispatch(fetchBoardById(id!));
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
    const trimmed = editTitle.trim();

    if (!trimmed) {
      setEditTitle(board.title); // откат
      setIsEditingTitle(false);
      return;
    }

    if (trimmed !== board.title) {
      await updateBoard(board.id, {title: trimmed});

      dispatch(fetchBoardById(id!));
    }

    setIsEditingTitle(false);
  };

  useEffect(() => {
    if (!isEditingTitle) return;

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
  }, [isEditingTitle, editTitle]);

  if (!board) return <div>Loading...</div>;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          marginBottom: 20,
          padding: 20,
          flexShrink: 0,
        }}
      >
        <div ref={titleRef}>
          {isEditingTitle ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              style={{
                fontSize: 26,
                fontWeight: "bold",
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid #ddd",
                outline: "none",
                textAlign: "center",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveBoardTitle();
                if (e.key === "Escape") {
                  setEditTitle(board.title);
                  setIsEditingTitle(false);
                }
              }}
            />
          ) : (
            <div
              onClick={() => {
                setEditTitle(board.title);
                setIsEditingTitle(true);
              }}
              style={{
                cursor: "pointer",
                fontSize: 26,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {board.title}
            </div>
          )}
        </div>
      </div>

      {/* добавление колонки */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 30,
          flexShrink: 0
        }}
      >
        <input
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
          placeholder="Новая колонка"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            outline: "none",
            width: 220,
          }}
        />

        <button
          onClick={handleCreateColumn}
          style={{
            background: "#f4a261",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Добавить
        </button>
      </div>

      {/* колонки */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowX: "auto",
            overflowY: "hidden",
          }}
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
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  paddingBottom: "0 20px",
                }}
              >
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
                  <div
                    style={{
                      background: "white",
                      padding: 10,
                      borderRadius: 12,
                      width: 250,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {activeCard.title}
                    </div>

                    {activeCard.description && (
                      <div style={{ marginTop: 4, color: "#555" }}>
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