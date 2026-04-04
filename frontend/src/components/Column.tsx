import { deleteCard, deleteColumn, uploadImage } from "../api/api";

export default function Column({ column, onAddCard, refresh  }: any) {
  const handleDeleteCard = async (id: number) => {
    if (!confirm("Удалить карточку?")) return;

    await deleteCard(id);
    refresh();
  };

  const handleDeleteColumn = async () => {
    if (!confirm("Удалить колонку?")) return;

    await deleteColumn(column.id);
    refresh();
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
          <div
            onClick={async () => {
              const newTitle = prompt("Новое название", card.title);
              if (!newTitle) return;

              await fetch(`http://127.0.0.1:8000/api/cards/${card.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: newTitle,
                  column_id: column.id,
                }),
              });

              refresh();
            }}
          >
            
            {card.title}
            {card.images.map((img: any) => (
              <img
                key={img.id}
                src={`http://127.0.0.1:8000/storage/${img.path}`}
                style={{ width: "100%", marginTop: 5 }}
              />
            ))}
          </div>

          <input
            type="file"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;

              const file = e.target.files[0];

              await uploadImage(card.id, file);
              refresh();
            }}
          />

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