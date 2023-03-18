import React, { useRef } from "react";
import styles from "./styles.module.scss";
import "./pdf.css";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { Timestamp } from "firebase/firestore";
function PDF(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Bon Comanda: ${formatDateTime(props.obj.createdAt)}`,
  });
  function formatDateTime(input) {
    var epoch = new Date(0);
    epoch.setSeconds(parseInt(input + 3600));
    var date = epoch.toISOString();
    date = date.replace("T", " ");
    return (
      date.split(".")[0].split(" ")[0] +
      " " +
      epoch.toLocaleTimeString().split(" ")[0]
    );
  }
  function getTotal() {
    var total = 0;
    props.obj.produse &&
      props.obj.produse.map((item) => {
        total += parseInt(item.Calcul) ? parseInt(item.Calcul) : 0;
        return null;
      });
    return total;
  }
  function getAvans() {
    var total = 0;
    props.obj.transe &&
      props.obj.transe.map((item) => {
        total += parseInt(item) ? parseInt(item) : 0;
        return null;
      });
    return total;
  }
  function getRest() {
    var rest = getTotal() - getAvans();
    return rest > 0 ? rest : 0;
  }

  return (
    <div className={styles.screenPdf} id="screenPdf">
      <div id="a4paper" ref={componentRef} className={styles.a4paper}>
        <div className="dataprintare">
          Data printarii: {formatDateTime(Timestamp.now().seconds)}
        </div>
        <div className="titlu">Bon comanda</div>
        <div className="datePrincipale">
          <div className="headerdenumiri">
            <div className="denumiri">Clientul: {props.obj.client} </div>
            <div className="denumiri">Adresa: {props.obj.adresa}</div>
          </div>
          <div className="headerdenumiri">
            <div className="denumiri">
              Numar de telefon: {props.obj.telefon}
            </div>
            <div className="denumiri">Total: {getTotal()}</div>
          </div>
          <div className="headerdenumiri">
            <div className="denumiri">Avans: {getAvans()}</div>
            <div className="denumiri">Rest de plata: {getRest()}</div>
          </div>
          <div className="headerdenumiri">
            <div
              className="denumiri"
              style={
                props.obj && props.obj.status === true
                  ? {
                      background: "rgba(7, 188, 12, 1)",
                      color: "white",
                    }
                  : {
                      background: "rgba(255, 0, 0, 1)",
                      color: "white",
                    }
              }
            >
              Statusul Plata:{" "}
              {props.obj.status === true ? "Achitata" : "Neachitata"}
            </div>
            <div
              className="denumiri"
              style={
                props.obj && props.obj.status2 === "true"
                  ? {
                      background: "rgba(7, 188, 12, 1)",
                      color: "white",
                    }
                  : {
                      background: "rgba(0, 0, 73, 1)",
                      color: "white",
                    }
              }
            >
              Statusul Comanda :{" "}
              {props.obj.status2 === "true" ? "Ridicata" : "Transcrisa"}
            </div>
          </div>
          <div className="headerdenumiri">
            <div className="denumiri">
              Data Crearii:{" "}
              {props.obj.createdAt && formatDateTime(props.obj.createdAt)}
            </div>
            <div className="denumiri">
              Data Ridicarii:{" "}
              {props.obj.ridicata && formatDateTime(props.obj.ridicata)}
            </div>
          </div>
        </div>
        <div className="tabel">
          <div className="trow" style={{ background: "rgb(229, 229, 229)" }}>
            <div className="tdata">Material</div>
            <div className="tdata">MP</div>
            <div className="tdata">ML</div>
            <div className="tdata">Calcul</div>
          </div>
          {props.obj.produse &&
            props.obj.produse.map((item, index) => {
              return (
                <div key={index} className="trow">
                  <div className="tdata">
                    {item.Material ? item.Material : "-"}
                  </div>
                  <div className="tdata">{item.MP ? item.MP : "-"}</div>
                  <div className="tdata">{item.ML ? item.ML : "-"}</div>
                  <div className="tdata">{item.Calcul ? item.Calcul : "-"}</div>
                </div>
              );
            })}
        </div>
      </div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.1 }}
        className={styles.printeazaBtn}
        onClick={handlePrint}
      >
        Printeaza Comanda
      </motion.div>
    </div>
  );
}

export default PDF;
