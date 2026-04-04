import { deleteCard } from "../api/api";

export default function Column({ column, onAddCard }: any) {
  const handleDeleteCard = async (id: number) => {
    if (!confirm("Удалить карточку?")) return;

    await deleteCard(id);
    window.location.reload(); // пока просто
  };

  return (
    <div
      style={{
        background: "#ebecf0",
        padding: 10,
        borderRadius: 8,
        width: 250,
      }}
    >
      <h3>{column.title}</h3>

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

          {/* ❌ удалить карточку */}
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