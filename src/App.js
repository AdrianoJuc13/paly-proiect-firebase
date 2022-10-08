import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaComanda from "./views/ListaComanda/ListaComanda";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ListaComanda />}>
            <Route path="*" element={<ListaComanda />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
