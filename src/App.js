import { useState, useEffect } from "react";
import { firebase } from "./firebaseConfig.js";

import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaComanda from "./views/ListaComanda/ListaComanda";
import "./App.css";
import AdaugaComanda from "./views/AdaugaComanda/AdaugaComanda.js";
import { ToastContainer } from "react-toastify";
import Login from "./views/Login";
import TopNav from "./components/TopNav/TopNav";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const userHandler = (user) =>
    user ? setCurrentUser(user) : setCurrentUser(null);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => userHandler(user));
  }, []);

  return (
    <>
      <ToastContainer position="top-center" />
      <BrowserRouter>
        {currentUser && <TopNav />}
        <div className="App">
          <Routes>
            {currentUser ? (
              <>
                <Route path="/" element={<ListaComanda />} />
                <Route path="/adaugaComanda" element={<AdaugaComanda />} />
                <Route path="/login" element={<h1>Sunteti deja logat</h1>} />
                <Route path="*" element={<h1>Pagina nu exista</h1>} />
              </>
            ) : (
              <>
                <Route exact path="/login" element={<Login />} />
              </>
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
