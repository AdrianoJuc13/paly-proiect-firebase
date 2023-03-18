import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import { v4 as uuidv4 } from "uuid";
import { DeleteTwoTone } from "@ant-design/icons";

export default function AdaugaComanda() {
  const navigate = useNavigate();
  const dbInstance = collection(database, "Comenzi");
  const [adresa, setAdresa] = useState("");
  const [client, setClient] = useState("");
  // const [status] = useState(false);
  const [status2] = useState(false);
  const [telefon, setTelefon] = useState("");
  const [avans, setAvans] = useState(0);
  const [inputFields, setInputFields] = useState([
    {
      id: uuidv4(),
      Material: "",
      MP: "",
      ML: "",
      Calcul: "",
    },
  ]);

  const pdfRef = useRef(null);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    let time = await Timestamp.now();
    addDoc(dbInstance, {
      client: client,
      adresa: adresa,
      status: false,
      status2: status2,
      telefon: telefon,
      createdAt: time.seconds,
      produse: inputFields,
      transe: [avans],
      ridicata: 0,
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
        Material: "",
        MP: "",
        ML: "",
        Calcul: "",
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

  // function getTotal() {
  //   var total = 0;

  //   inputFields &&
  //     inputFields.map((item) => {
  //       total += parseInt(item.Calcul) ? parseInt(item.Calcul) : 0;
  //       return null;
  //     });
  //   return total;
  // }

  // useEffect(() => {
  //   if (getTotal() - (parseInt(avans) ? parseInt(avans) : 0) > 0)
  //     setRestPlata(getTotal() - (parseInt(avans) ? parseInt(avans) : 0));
  //   else setRestPlata(0);
  // }, [avans, getTotal()]);

  // useEffect(() => {
  //   setTranse([avans]);
  // }, [avans]);
  return (
    <Layout>
      <div ref={pdfRef} className={styles.screen}>
        <div className={styles.titlu}>Adauga comanda</div>
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
              type="text"
              value={telefon}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Avans</label>
            <input
              className={styles.input}
              onChange={(e) => {
                setAvans(e.target.value);
              }}
              type="text"
              value={avans}
            />
          </div>
          {/* <div className={styles.field}>
            <label className={styles.label}>Rest de plata</label>
            <div className={styles.input}>{transe[0] ? transe[0] : 0}</div>
          </div> */}
        </div>

        <div className={styles.ListaProduse}>
          <form className={styles.form}>
            {inputFields.map((inputField, index) => (
              <div id={inputField.id} className={styles.rand} key={index}>
                <div className={styles.row} key={inputField.id}>
                  <div className={styles.textHeaderInput}>{index + 1}</div>
                  <div className={styles.rowData}>
                    <input
                      className={styles.input}
                      name="Material"
                      placeholder="Material"
                      value={inputField.Material}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <input
                      className={styles.input}
                      name="MP"
                      placeholder="MP"
                      value={inputField.MP}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <input
                      className={styles.input}
                      placeholder="ML"
                      name="ML"
                      value={inputField.ML}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <input
                      className={styles.input}
                      name="Calcul"
                      placeholder="Calcul"
                      value={inputField.Calcul}
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
                    <DeleteTwoTone />
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
            <button className={styles.adaugaProdus} onClick={handleAddFields}>
              Adauga Produs
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
