import {
  deleteCard,
  uploadImage,
  updateCard,
  deleteImage,
} from "../../api/api";

import { useState } from "react";
import Modal from "../Modal";

export default function Card({
  card,
  columnId,
  refresh,
  setGlobalModalOpen,
}: any) {

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(
    `${card.title}\n${card.description || ""}`
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openModal = () => {
    setText(`${card.title}\n${card.description || ""}`);
    setIsOpen(true);
    setGlobalModalOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setGlobalModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setGlobalModalOpen(false);
  };

  const handleSave = async () => {
    const lines = text.split("\n");

    await updateCard(card.id, {
      title: lines[0],
      description: lines.slice(1).join("\n"),
      column_id: columnId,
    });

    setIsOpen(false);
    refresh();
  };

  const handleDeleteCard = async () => {
    await deleteCard(card.id);
    setIsDeleteOpen(false);
    setIsOpen(false);
    refresh();
  };

  const handleDeleteImage = async (imageId: number) => {
    await deleteImage(imageId);
    refresh();
  };

  const handleUpload = async (file: File) => {
    await uploadImage(card.id, file);
    refresh();
  };

  return (
    <div
      onClick={openModal}
      style={{
        background: "#fff",
        padding: 10,
        borderRadius: 12,
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 6px 16px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 2px 6px rgba(0,0,0,0.06)";
      }}
    >
      {/* заголовок */}
      <div
        style={{
          fontWeight: 600,
          fontSize: 14,
          marginBottom: card.description ? 4 : 0,
        }}
      >
        {card.title}
      </div>

      {card.description && (
        <div
          style={{
            fontSize: 13,
            color: "#555",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {card.description}
        </div>
      )}

      {card.images?.length > 0 && (
        <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
          📎 {card.images.length}
        </div>
      )}

      {/** модалка редактирования */}
      <Modal open={isOpen} onClose={closeModal}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              minHeight: 150,
              padding: 12,
              fontSize: 14,
              borderRadius: 10,
              border: "1px solid #ddd",
              outline: "none",
              resize: "none",
            }}
          />

          {/* изображения */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {card.images?.map((img: any) => (
              <div
                key={img.id}
                style={{
                  position: "relative",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <img
                  src={`http://127.0.0.1:8000/storage/${img.path}`}
                  style={{
                    width: "25%",
                    display: "block",
                  }}
                />

                <button
                  onClick={() => handleDeleteImage(img.id)}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "2px 6px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* загрузка */}
          <label
            style={{
              padding: 10,
              borderRadius: 10,
              background: "#f4a261",
              color: "white",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            + Добавить изображение
            <input
              type="file"
              hidden
              onChange={(e) => {
                if (!e.target.files?.[0]) return;
                handleUpload(e.target.files[0]);
              }}
            />
          </label>

          {/* кнопки */}
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button
              onClick={handleSave}
              style={{
                background: "#f4a261",
                color: "white",
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
              }}
            >
              Сохранить
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
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
              onClick={() => setIsOpen(false)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #ddd",
                cursor: "pointer",
                background: "white",
              }}  
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

        {/** подтверждение удаления */}
      <Modal open={isDeleteOpen} onClose={closeDeleteModal}>
        <h3>Точно удалить карточку?</h3>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleDeleteCard}
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
            onClick={closeDeleteModal}
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