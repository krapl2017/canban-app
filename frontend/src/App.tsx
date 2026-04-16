import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoardsPage from "./pages/BoardsPage/BoardsPage";
import BoardPage from "./pages/BoardPage/BoardPage";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
    <Layout>
        <Routes>
          <Route path="/" element={<BoardsPage />} />
          <Route path="/boards/:id" element={<BoardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Layout>
    </BrowserRouter>
  );
}

export default App;