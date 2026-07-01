import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProjectsPage } from "./pages/ProjectsPage";
import { BacklogPage } from "./pages/BacklogPage";
import { BoardPage } from "./pages/BoardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path="backlog" element={<BacklogPage />} />
          <Route path="board" element={<BoardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
