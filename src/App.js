import { useState, useEffect } from "react";
import { firebase } from "./firebaseConfig.js";

import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListaComanda from "./views/ListaComanda/ListaComanda";
import "./App.css";
import AdaugaComanda from "./views/AdaugaComanda/AdaugaComanda.js";
import { ToastContainer } from "react-toastify";
import Login from "./views/Login";
import PDF from "./views/ListaComanda/PDF.js";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const userHandler = (user) =>
    user ? setCurrentUser(user) : setCurrentUser(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      userHandler(user);
      user && window.localStorage.setItem("user", "true");
    });
    currentUser === null && window.localStorage.removeItem("user");
  }, [currentUser]);

  return (
    <>
      <ToastContainer position="top-center" />
      <BrowserRouter>
        <div className="App">
          <Routes>
            {localStorage.getItem("user") !== null || currentUser !== null ? (
              <>
                <Route path="/" element={<ListaComanda />} />
                <Route path="/adaugaComanda" element={<AdaugaComanda />} />
                <Route path="/pdf" element={<PDF />} />
                <Route path="*" element={<Navigate to="/" replace={true} />} />
              </>
            ) : (
              <>
                <Route exact path="/login" element={<Login />} />
                <Route
                  path="*"
                  element={<Navigate to="/login" replace={true} />}
                />
              </>
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
