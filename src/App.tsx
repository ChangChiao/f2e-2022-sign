import { Route, Routes, BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Manufacture from "./pages/Manufacture";
import UploadPDF from "./components/UploadPDF";
import NotFound from "./pages/NotFound";
import Default from "./layout/Default";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Default />}>
          <Route index element={<Index />} />
          <Route path="/manufacture" element={<Manufacture />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
