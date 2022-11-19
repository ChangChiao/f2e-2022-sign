import { Route, Routes, HashRouter } from "react-router-dom";
import Index from "./pages/Index";
import Manufacture from "./pages/Manufacture";
import UploadPDF from "./components/UploadPDF";
import NotFound from "./pages/NotFound";
import Finish from "./pages/Finish";
import Default from "./layout/Default";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Default />}>
          <Route index element={<Index />} />
          <Route path="/manufacture" element={<Manufacture />} />
          <Route path="/finish" element={<Finish />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
