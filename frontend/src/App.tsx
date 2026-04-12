import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoardsPage from "./pages/BoardsPage";
import BoardPage from "./pages/BoardPage";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
    <Layout>
        <Routes>
          <Route path="/" element={<BoardsPage />} />
          <Route path="/boards/:id" element={<BoardPage />} />
        </Routes>
    </Layout>
    </BrowserRouter>
  );
}

export default App;