import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createColumn, createCard, reorderCards } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoardById, setBoard } from "../features/boards/boardSlice";
import type { RootState } from "../app/store";
import Column from "../components/Column";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import Modal from "../components/Modal";

export default function BoardPage() {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const board = useSelector((state: RootState) => state.boards.currentBoard);
  const [activeCard, setActiveCard] = useState<any>(null);
  const [columnTitle, setColumnTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: isModalOpen ? 9999 : 5 },
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const id = Number(active.id);

    const card = board.columns
      .flatMap((col: any) => col.cards)
      .find((c: any) => c.id === id);

    setActiveCard(card);
  };

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

  const handleCreateCard = (columnId: number) => {
    setSelectedColumnId(columnId);
    setIsCreateCardOpen(true);
  };

  const handleSaveCard = async () => {
    if (!newCardTitle || !selectedColumnId) return;

    await createCard({
      title: newCardTitle,
      column_id: selectedColumnId,
    });

    setNewCardTitle("");
    setIsCreateCardOpen(false);
    dispatch(fetchBoardById(id!));
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
        <div style={{ display: "flex", gap: 20 }}>
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
                padding: 8,
                borderRadius: 6,
                width: 250,
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                {activeCard.title}
              </div>

              {activeCard.description && (
                <div style={{ marginTop: 4 }}>
                  {activeCard.description}
                </div>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <Modal
        open={isCreateCardOpen}
        onClose={() => setIsCreateCardOpen(false)}
      >
        <h3>Новая карточка</h3>

        <textarea
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="Название карточки"
          style={{
            width: "100%",
            marginTop: 10,
            padding: 6,
          }}
        />

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleSaveCard}
            style={{
              background: "#0079bf",
              color: "white",
              padding: "6px 12px",
            }}
          >
            Создать
          </button>

          <button onClick={() => setIsCreateCardOpen(false)}>
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}