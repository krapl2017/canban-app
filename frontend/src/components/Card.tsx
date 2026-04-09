import {
  deleteCard,
  uploadImage,
  updateCard,
  deleteImage,
} from "../api/api";

export default function Card({
  card,
  columnId,
  refresh,
}: any) {
  const handleDeleteCard = async () => {
    if (!confirm("Удалить карточку?")) return;

    await deleteCard(card.id);
    refresh();
  };

  const handleEditCard = async () => {
    const text = prompt(
      "Редактировать карточку",
      `${card.title}\n${card.description || ""}`
    );

    if (!text) return;

    const lines = text.split("\n");

    await updateCard(card.id, {
      title: lines[0],
      description: lines.slice(1).join("\n"),
      column_id: columnId,
    });

    refresh();
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Удалить изображение?")) return;

    await deleteImage(imageId);
    refresh();
  };

  return (
    <div
      style={{
        background: "white",
        padding: 8,
        marginBottom: 8,
        borderRadius: 4,
        position: "relative",
      }}
    >
      <div onClick={handleEditCard} style={{ cursor: "pointer" }}>
        <div style={{ fontWeight: "bold" }}>{card.title}</div>

        {card.description && (
          <div style={{ marginTop: 4 }}>
            {card.description}
          </div>
        )}
      </div>

      {card.images?.map((img: any) => (
        <div key={img.id} style={{ position: "relative" }}>
          <img
            src={`http://127.0.0.1:8000/storage/${img.path}`}
            style={{ width: "100%", marginTop: 5 }}
          />

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

      <input
        type="file"
        onChange={async (e) => {
          if (!e.target.files?.[0]) return;

          await uploadImage(card.id, e.target.files[0]);
          refresh();
        }}
      />

      <button
        onClick={handleDeleteCard}
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
  );
}