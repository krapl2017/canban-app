import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const createColumn = (data: { title: string; board_id: number }) =>
  api.post("/columns", data);

export const createCard = (data: {
  title: string;
  description?: string;
  column_id: number;
}) => api.post("/cards", data);

export const deleteBoard = (id: number) =>
  api.delete(`/boards/${id}`);

export const deleteCard = (id: number) =>
  api.delete(`/cards/${id}`);

export const deleteColumn = (id: number) =>
  api.delete(`/columns/${id}`);

export const uploadImage = (cardId: number, file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  return api.post(`/cards/${cardId}/images`, formData);
};