import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaComanda from "./views/ListaComanda/ListaComanda";
import "./App.css";
import AdaugaComanda from "./views/AdaugaComanda/AdaugaComanda.js";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ListaComanda />} />
          <Route path="/adaugaComanda" element={<AdaugaComanda />} />
          <Route path="*" element={<ListaComanda />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
