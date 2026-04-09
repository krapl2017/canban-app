import {
  deleteCard,
  uploadImage,
  updateCard,
  deleteImage,
} from "../api/api";

import { useState } from "react";
import Modal from "./Modal";

export default function Card({
  card,
  columnId,
  refresh,
}: any) {

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(
    `${card.title}\n${card.description || ""}`
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openModal = () => {
    setText(`${card.title}\n${card.description || ""}`);
    setIsOpen(true);
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
      style={{
        background: "white",
        padding: 8,
        marginBottom: 8,
        borderRadius: 4,
        position: "relative",
      }}
    >
      <div onClick={openModal} style={{ cursor: "pointer" }}>
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
        onClick={() => setIsDeleteOpen(true)}
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

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        {/* textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            minHeight: 120,
            padding: 10,
            fontSize: 14,
          }}
        />

        {/* изображения */}
        <div style={{ marginTop: 10 }}>
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
        </div>

        {/* загрузка */}
        <input
          type="file"
          onChange={(e) => {
            if (!e.target.files?.[0]) return;
            handleUpload(e.target.files[0]);
          }}
          style={{ marginTop: 10 }}
        />

        {/* кнопки */}
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleSave}
            style={{
              background: "#0079bf",
              color: "white",
              padding: "6px 12px",
            }}
          >
            Сохранить
          </button>

          <button
            onClick={() => setIsDeleteOpen(true)}
            style={{
              background: "red",
              color: "white",
              padding: "6px 12px",
            }}
          >
            Удалить
          </button>

          <button onClick={() => setIsOpen(false)}>
            Закрыть
          </button>
        </div>
      </Modal>

      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <h3>Точно удалить карточку?</h3>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            onClick={handleDeleteCard}
            style={{
              background: "red",
              color: "white",
              padding: "6px 12px",
            }}
          >
            Удалить
          </button>

          <button onClick={() => setIsDeleteOpen(false)}>
            Отмена
          </button>
        </div>
      </Modal>

    </div>
  );
}