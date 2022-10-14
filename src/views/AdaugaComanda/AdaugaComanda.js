import { database } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";

export default function AdaugaComanda() {
  const dbInstance = collection(database, "Comenzi");
  const [adresa, setAdresa] = useState("");
  const [client, setClient] = useState("");
  const [status] = useState(false);
  const [dataProcess, setDataProcess] = useState("");

  const [nume, setNume] = useState("");
  const [lungime, setLungime] = useState("");
  const [latime, setLatime] = useState("");
  const [grosime, setGrosime] = useState("");
  const [cantiate, setCantitate] = useState("");
  const [pret, setPret] = useState("");
  const [produse, setProduse] = useState([]);

  // let arrayProduse = [];

  const saveComanda = () => {
    addDoc(dbInstance, {
      client: client,
      adresa: adresa,
      status: status,
      dataProcess: dataProcess,
      produse: {},
    }).then(() => {});
  };
  useEffect(() => {
    // arrayProduse.push();
    setProduse();
    console.log(produse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantiate, grosime, latime, lungime, nume, pret]);
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
        <div className={styles.ListaProduse}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                <th className={styles.th}>Nume Produs</th>
                <th className={styles.th}>Lungime</th>
                <th className={styles.th}>Latime</th>
                <th className={styles.th}>Grosime</th>
                <th className={styles.th}>Cantitate</th>
                <th className={styles.th}>Pret</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {
                <tr className={styles.tr}>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      placeholder="Piatra"
                      type="text"
                      onChange={(e) => setNume(e.target.value)}
                    ></input>
                  </td>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      placeholder="120cm"
                      type="number"
                      onChange={(e) => setLungime(e.target.value)}
                    ></input>
                  </td>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      placeholder="23cm"
                      type="number"
                      onChange={(e) => setLatime(e.target.value)}
                    ></input>
                  </td>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      placeholder="5cm"
                      type="number"
                      onChange={(e) => setGrosime(e.target.value)}
                    ></input>
                  </td>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      placeholder="3 buc."
                      type="number"
                      onChange={(e) => setCantitate(e.target.value)}
                    ></input>
                  </td>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      placeholder="123$"
                      type="number"
                      onChange={(e) => setPret(e.target.value)}
                    ></input>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div className={styles.endArea}>
          <button className={styles.savePrintBtn} onClick={saveComanda}>
            Save
          </button>
          <button className={styles.savePrintBtn}>Print</button>
        </div>
      </div>
    </Layout>
  );
}
