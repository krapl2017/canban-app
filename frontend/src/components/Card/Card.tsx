import {
  deleteCard,
  uploadImage,
  updateCard,
  deleteImage,
} from "../../api/api";

import { useState } from "react";
import Modal from "../Modal";
import styles from "./Card.module.css"

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
      className={styles.card}
    >
      {/* заголовок */}
      <div className={styles.cardTitle}>
        {card.title}
      </div>

      {card.description && (
        <div className={styles.cardDescription}>
          {card.description}
        </div>
      )}

      {card.images?.length > 0 && (
        <div className={styles.cardImagesCount}>
          📎 {card.images.length}
        </div>
      )}

      {/** модалка редактирования */}
      <Modal open={isOpen} onClose={closeModal}>
        <div className={styles.cardModal}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.cardTextarea}
          />

          {/* изображения */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {card.images?.map((img: any) => (
              <div
                key={img.id}
                className={styles.cardImageWrapper}
              >
                <img
                  src={`http://127.0.0.1:8000/storage/${img.path}`}
                  className={styles.cardImage}
                />

                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className={styles.cardImageDelete}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* загрузка */}
          <label className={styles.cardUpload}>
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
          <div className={styles.cardActions}>
            <button
              onClick={handleSave}
              className="button button-primary"
            >
              Сохранить
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="button button-primary"
            >
              Удалить
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="button" 
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

        {/** подтверждение удаления */}
      <Modal open={isDeleteOpen} onClose={closeDeleteModal}>
        <h3>Точно удалить карточку?</h3>

        <div className={styles.cardActions}>
          <button
            onClick={handleDeleteCard}
            className="button button-primary"
          >
            Удалить
          </button>

          <button
            onClick={closeDeleteModal}
            className="button" 
          >
            Отмена
          </button>
        </div>
      </Modal>

    </div>
  );
}