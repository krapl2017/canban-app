import { deleteCard, deleteColumn } from "../api/api";

export default function Column({ column, onAddCard }: any) {
  const handleDeleteCard = async (id: number) => {
    if (!confirm("Удалить карточку?")) return;

    await deleteCard(id);
    window.location.reload();
  };

  const handleDeleteColumn = async () => {
    if (!confirm("Удалить колонку?")) return;

    await deleteColumn(column.id);
    window.location.reload();
  };

  return (
    <div
      style={{
        background: "#ebecf0",
        padding: 10,
        borderRadius: 8,
        width: 250,
        position: "relative",
      }}
    >
      <h3>{column.title}</h3>

      {/* удалить колонку */}
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

      {column.cards.map((card: any) => (
        <div
          key={card.id}
          style={{
            background: "white",
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
            position: "relative",
          }}
        >
          {card.title}

          <button
            onClick={() => handleDeleteCard(card.id)}
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
        </div>
      ))}

      <button onClick={() => onAddCard(column.id)}>
        + Добавить карточку
      </button>
    </div>
  );
}