import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState<any>(null);

  useEffect(() => {
    api.get(`/boards/${id}`).then((res) => setBoard(res.data));
  }, [id]);

  if (!board) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{board.title}</h1>

      {board.columns.map((col: any) => (
        <div key={col.id} style={{ marginBottom: 20 }}>
          <h3>{col.title}</h3>

          {col.cards.map((card: any) => (
            <div key={card.id}>
              {card.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}