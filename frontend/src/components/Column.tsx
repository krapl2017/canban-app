import {
  deleteCard,
  deleteColumn,
  uploadImage,
  updateColumn,
  updateCard,
  deleteImage,
} from "../api/api";

export default function Column({ column, onAddCard, refresh }: any) {
  // удалить карточку
  const handleDeleteCard = async (id: number) => {
    if (!confirm("Удалить карточку?")) return;

    await deleteCard(id);
    refresh();
  };

  // удалить колонку
  const handleDeleteColumn = async () => {
    if (!confirm("Удалить колонку?")) return;

    await deleteColumn(column.id);
    refresh();
  };

  // редактировать колонку
  const handleEditColumn = async () => {
    const newTitle = prompt("Новое название колонки", column.title);
    if (!newTitle) return;

    await updateColumn(column.id, { title: newTitle });

    refresh();
  };

  // редактировать карточку
  const handleEditCard = async (card: any) => {
    const text = prompt(
      "Редактировать карточку (первая строка — заголовок)",
      `${card.title}\n${card.description || ""}`
    );

    if (!text) return;

    const lines = text.split("\n");

    const title = lines[0];
    const description = lines.slice(1).join("\n");

    await updateCard(card.id, {
      title,
      description,
      column_id: column.id,
    });

    refresh();
  };

  // удалить изображение
  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Удалить изображение?")) return;

    await deleteImage(imageId);

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
      {/* редактирование колонки */}
      <h3
        onClick={handleEditColumn}
        style={{ cursor: "pointer" }}
      >
        {column.title}
      </h3>

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
          {/* карточка как заметка */}
          <div
            onClick={() => handleEditCard(card)}
            style={{ cursor: "pointer" }}
          >
            {/* заголовок */}
            <div style={{ fontWeight: "bold" }}>
              {card.title}
            </div>

            {/* описание */}
            {card.description && (
              <div style={{ marginTop: 4 }}>
                {card.description}
              </div>
            )}
          </div>

          {/* изображения */}
          {card.images?.map((img: any) => (
            <div key={img.id} style={{ position: "relative" }}>
              <img
                src={`http://127.0.0.1:8000/storage/${img.path}`}
                style={{ width: "100%", marginTop: 5 }}
              />

              {/* удалить изображение */}
              <button
                onClick={() => handleDeleteImage(img.id)}
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

          {/* загрузка */}
          <input
            type="file"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;

              const file = e.target.files[0];

              await uploadImage(card.id, file);
              refresh();
            }}
          />

          {/* удалить карточку */}
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