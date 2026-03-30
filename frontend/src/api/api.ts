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