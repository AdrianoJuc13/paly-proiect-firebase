import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import { v4 as uuidv4 } from "uuid";
import { MinusOutlined } from "@ant-design/icons";

export default function AdaugaComanda() {
  const navigate = useNavigate();
  const dbInstance = collection(database, "Comenzi");
  const [adresa, setAdresa] = useState("");
  const [client, setClient] = useState("");
  const [status] = useState(false);
  const [telefon, setTelefon] = useState("");
  const [inputFields, setInputFields] = useState([
    {
      id: uuidv4(),
      nume: "",
      lungime: "",
      latime: "",
      grosime: "",
      cantitate: "",
      pret: "",
    },
  ]);

  const pdfRef = useRef(null);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    let time = await Timestamp.now();
    addDoc(dbInstance, {
      client: client,
      adresa: adresa,
      status: status,
      telefon: telefon,
      createdAt: time.seconds,
      produse: inputFields,
    }).then(() => {
      navigate("/");
    });
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setInputFields(newInputFields);
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        id: uuidv4(),
        nume: "",
        lungime: "",
        latime: "",
        grosime: "",
        cantitate: "",
        pret: "",
      },
    ]);
  };

  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  // let arrayProduse = [];

  // const saveComanda = () => {};

  const submitDownload = async () => {
    const content = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `Comanda client ${client}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      pagebreak: { mode: "avoid-all" },
      html2canvas: { useCORS: true, allowTaint: true },
      // jsPDF: { compress: true },
    };
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf(content, opt);
  };

  return (
    <Layout>
      <div ref={pdfRef} className={styles.screen}>
        <div className={styles.titlu}>Creaza comanda</div>
        <div className={styles.container}>
          <div className={styles.field}>
            <label className={styles.label}> Numele clientului</label>
            <input
              className={styles.input}
              onChange={(e) => setClient(e.target.value)}
              type="text"
              value={client}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}> Adresa</label>
            <input
              className={styles.input}
              onChange={(e) => setAdresa(e.target.value)}
              type="text"
              value={adresa}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Numar de telefon</label>
            <input
              className={styles.input}
              onChange={(e) => setTelefon(e.target.value)}
              type="number"
              value={telefon}
            />
          </div>
        </div>
        <button className={styles.adaugaProdus} onClick={handleAddFields}>
          Adauga Produs
        </button>
        <div className={styles.ListaProduse}>
          <form className={styles.form}>
            {inputFields.map((inputField, index) => (
              <div>
                <h3 className={styles.textHeaderInput}>
                  Produs numar {index + 1}
                </h3>
                <div className={styles.row} key={inputField.id}>
                  <div className={styles.rowData}>
                    <input
                      className={styles.input}
                      name="nume"
                      placeholder="nume"
                      value={inputField.nume}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <input
                      className={styles.input}
                      name="lungime"
                      placeholder="lungime"
                      value={inputField.lungime}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <input
                      className={styles.input}
                      name="latime"
                      placeholder="latime"
                      value={inputField.latime}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <input
                      className={styles.input}
                      name="grosime"
                      placeholder="grosime"
                      value={inputField.grosime}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <input
                      className={styles.input}
                      name="cantitate"
                      placeholder="cantitate"
                      value={inputField.cantitate}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <input
                      className={styles.input}
                      name="pret"
                      placeholder="pret"
                      value={inputField.pret}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                  </div>
                  <div
                    className={styles.removeBtn}
                    disabled={inputFields.length === 1}
                    onClick={() => handleRemoveFields(inputField.id)}
                  >
                    <MinusOutlined />
                  </div>
                </div>
              </div>
            ))}
          </form>
          <div className={styles.endArea}>
            <button
              className={styles.saveBtn}
              type="submit"
              onClick={() => {
                handleSubmit();
              }}
            >
              Salveaza
            </button>
            <button
              onClick={() => submitDownload()}
              className={styles.printBtn}
            >
              Printeaza
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
