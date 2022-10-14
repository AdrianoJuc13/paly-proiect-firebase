import { database } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import { v4 as uuidv4 } from "uuid";

export default function AdaugaComanda() {
  const dbInstance = collection(database, "Comenzi");
  const [adresa, setAdresa] = useState("");
  const [client, setClient] = useState("");
  const [status] = useState(false);
  const [dataProcess, setDataProcess] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    addDoc(dbInstance, {
      client: client,
      adresa: adresa,
      status: status,
      dataProcess: dataProcess,
      produse:
        inputFields &&
        inputFields.map((item) => {
          return JSON.stringify(item);
        }),
    }).then(() => {});
    alert(
      inputFields &&
        inputFields.map((item) => {
          return JSON.stringify(item);
        })
    );
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setInputFields(newInputFields);
    console.log(
      `${
        inputFields &&
        inputFields.map((item) => {
          return JSON.stringify(item);
        })
      }`
    );
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

  const saveComanda = () => {};
  return (
    //sadasdas
    <Layout>
      <div className={styles.full}>
        <button className={styles.MenuBtn}>{`<${" "}Menu`}</button>
        <div className={styles.titlu}>Creaza comanda</div>
        <div className={styles.container}>
          <div className={styles.field}>
            <label className={styles.label}> Numele clientului</label>
            <input
              className={styles.input}
              placeholder="Ex: Victor Lucan"
              onChange={(e) => setClient(e.target.value)}
              type="text"
              value={client}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}> Adresa</label>
            <input
              className={styles.input}
              placeholder="Ex: Dolhasca, nr. 187"
              onChange={(e) => setAdresa(e.target.value)}
              type="text"
              value={adresa}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}> Date de procesare</label>
            <input
              className={styles.input}
              placeholder="Ex: se genereaza factura"
              onChange={(e) => setDataProcess(e.target.value)}
              type="text"
              value={dataProcess}
            />
          </div>
        </div>
        <button className={styles.adaugaProdus}>Adauga Produs</button>
        <div>
          <h1>Add New Member</h1>
          <form onSubmit={handleSubmit}>
            {inputFields.map((inputField) => (
              <div key={inputField.id}>
                <input
                  name="nume"
                  placeholder="nume"
                  value={inputField.nume}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <input
                  name="lungime"
                  placeholder="lungime"
                  value={inputField.lungime}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <input
                  name="latime"
                  placeholder="latime"
                  value={inputField.latime}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <input
                  name="grosime"
                  placeholder="grosime"
                  value={inputField.grosime}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <input
                  name="cantitate"
                  placeholder="cantitate"
                  value={inputField.cantitate}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <input
                  name="pret"
                  placeholder="pret"
                  value={inputField.pret}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                />
                <div
                  disabled={inputFields.length === 1}
                  onClick={() => handleRemoveFields(inputField.id)}
                >
                  -
                </div>
                <div onClick={handleAddFields}>+</div>
              </div>
            ))}
            <button type="submit" onClick={handleSubmit}>
              Send
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
