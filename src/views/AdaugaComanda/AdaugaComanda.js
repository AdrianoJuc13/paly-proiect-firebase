import { database } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import { v4 as uuidv4 } from "uuid";
import { MinusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (client && adresa) console.log("ii ok ");
    else console.log("nu i ok");
    addDoc(dbInstance, {
      client: client,
      adresa: adresa,
      status: status,
      telefon: telefon,
      produse: inputFields,
      // &&
      // inputFields.map((item) => {
      //   return JSON.stringify(item);
      // }),
    }).then(() => {
      navigate("/");
    });
    // alert(
    //   inputFields &&
    //     inputFields.map((item) => {
    //       return JSON.stringify(item);
    //     })
    // );
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

  return (
    <Layout>
      <div className={styles.screen}>
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
          <form className={styles.form} onSubmit={handleSubmit}>
            {inputFields.map((inputField) => (
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
            ))}

            <div className={styles.endArea}>
              <button
                className={styles.saveBtn}
                type="submit"
                onClick={handleSubmit}
              >
                Salveaza
              </button>
              <button className={styles.printBtn}>Printeaza</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
