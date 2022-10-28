import { useState, useEffect } from "react";
import { database } from "../../firebaseConfig";
import { collection, deleteDoc, doc } from "firebase/firestore";

import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import { motion } from "framer-motion";
import { CloseCircleOutlined } from "@ant-design/icons";
import useWindowDimensions from "../../assets/hooks/useWindowDimensions";
export default function ListaComanda() {
  const dbInstance = collection(database, "Comenzi");
  // const [deschidereComanda, setDeschidereComanda] = useState(true);
  const [comanda, setComanda] = useState([]);
  const [deschis, setDeschis] = useState(0);
  const [editeaza, setEditeaza] = useState(false);
  const [comandaFiltrata, setComandaFiltrata] = useState(comanda);
  const [comandaFiltrataInit, setComandaFiltrataInit] = useState(false);
  const [sorted, setSorted] = useState("asc");

  const handleChange = (event) => {
    setSorted(event.target.value);
  };

  const getComanda = async () => {
    const createdAt = await database
      .collection("Comenzi")
      .orderBy("createdAt", sorted)
      .get();
    setComanda(createdAt.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };
  const deleteComanda = async (id) => {
    try {
      const todoRef = doc(dbInstance, id);
      await deleteDoc(todoRef).then(() => {
        alert("deleted");
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getComanda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted]);

  const { width } = useWindowDimensions();

  return (
    <Layout>
      <div className={styles.screen}>
        <div className={styles.container2}>Lista Comenzi</div>
        <div className={styles.searchField}>
          <div class="form-outline">
            <input
              type="search"
              id="form1"
              class="form-control text-black"
              placeholder="Cauta comanda"
              aria-label="Search"
              onChange={(e) => {
                if (e.target.value === "") {
                  setComandaFiltrataInit(false);
                }
                let results = comanda.filter((data) =>
                  data.client
                    .toUpperCase()
                    .includes(e.target.value.toUpperCase())
                );
                setComandaFiltrata(results);
                setComandaFiltrataInit(true);
                console.log(comandaFiltrata);
              }}
            />
          </div>
        </div>
        <div className={styles.container3}>
          <div className={styles.headerContainer}>
            <div className={styles.textHeaderContainer}>
              Comenzi : {comanda.length}
            </div>
            <select
              class="form-select form-select-sm w-20"
              aria-label=".form-select-sm example"
              onChange={handleChange}
            >
              <option selected value="asc">
                Crescator
              </option>
              <option value="desc">Descrescator</option>
            </select>
          </div>
          <div className={styles.headerComanda}>
            <div className={styles.headerComandaChild}>Clientul</div>
            <div className={styles.headerComandaChild}>Adresa</div>
            <div className={styles.headerComandaChild}>ID-ul comenzi</div>
            <div className={styles.headerComandaChild}>Numar de telefon</div>
            <div className={styles.headerComandaChild}>Statusul</div>
          </div>

          <div>
            {comanda &&
              (comandaFiltrataInit ? comandaFiltrata : comanda).map((item) => {
                return (
                  <div key={item.id} className={styles.Comanda}>
                    <div
                      className={styles.headerField}
                      onClick={() => {
                        deschis === item.id
                          ? setDeschis(0)
                          : setDeschis(item.id);
                      }}
                    >
                      <div
                        className={`${styles.comandaItem} ${styles.comandaClient}`}
                      >
                        {item.client}
                      </div>
                      <div className={`${styles.comandaItem}`}>
                        {item.adresa}
                      </div>
                      <div
                        className={`${styles.comandaItem} ${styles.comandaId}`}
                      >
                        {item.id}
                      </div>
                      <div className={styles.telefon}>{item.telefon}</div>
                      <div
                        className={styles.comandaStatus}
                        style={
                          item.status
                            ? {
                                background: "#6CAD55",
                              }
                            : {
                                background: "rgba(221, 3, 3, 0.75)",
                              }
                        }
                      >
                        {item.status ? "Livrata" : "In pregatire"}
                      </div>
                    </div>
                    <motion.div
                      layout
                      transition={{ duration: 0.15 }}
                      className={styles.bodyField}
                    >
                      <div
                        className={
                          deschis === item.id ? styles.deschisComanda : null
                        }
                      >
                        {item.id === deschis ? (
                          <div className={styles.tabel}>
                            {width >= 850 && (
                              <div className={styles.randProdusTitlu}>
                                <div className={styles.produsTitlu}>
                                  Nume Produs
                                </div>
                                <div className={styles.produsTitlu}>
                                  Lungime cm
                                </div>
                                <div className={styles.produsTitlu}>
                                  Latime cm
                                </div>
                                <div className={styles.produsTitlu}>
                                  Grosime cm
                                </div>
                                <div className={styles.produsTitlu}>
                                  Cantitate
                                </div>
                                <div className={styles.produsTitlu}>Pret</div>
                              </div>
                            )}

                            {item.produse.map((produs, index) => {
                              return (
                                <div>
                                  <div>
                                    <div
                                      key={index}
                                      className={styles.randProdus}
                                    >
                                      <div className={styles.produs}>
                                        {width <= 850 && <div>Nume:</div>}
                                        <div>{produs.nume}</div>
                                      </div>
                                      <div className={styles.produs}>
                                        {width <= 850 && <div>Lungime:</div>}
                                        {produs.lungime}
                                      </div>
                                      <div className={styles.produs}>
                                        {width <= 850 && <div>Latime:</div>}
                                        {produs.latime}
                                      </div>
                                      <div className={styles.produs}>
                                        {width <= 850 && <div>Grosime:</div>}
                                        {produs.grosime}
                                      </div>
                                      <div className={styles.produs}>
                                        {width <= 850 && <div>Cantitate:</div>}
                                        {produs.cantitate}
                                      </div>
                                      <div className={styles.produs}>
                                        {width <= 850 && <div>Pret:</div>}
                                        {produs.pret}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              transition={{ duration: 0.1 }}
                              className={styles.editBtn}
                              onClick={() => {
                                setEditeaza(item.id);
                                console.log(item);
                              }}
                            >
                              Editeaza Comanda
                            </motion.div>

                            {editeaza ? (
                              <div className={styles.editPage}>
                                <div className={styles.editScreen}>
                                  <div
                                    className={styles.closeBtn}
                                    onClick={() => {
                                      setEditeaza(0);
                                    }}
                                  >
                                    <CloseCircleOutlined />
                                  </div>
                                  <div className={styles.form}>
                                    <div className={styles.headerValues}>
                                      <div className={styles.property}>
                                        <div className={styles.label}>
                                          Numele Clientului
                                        </div>
                                        <input
                                          defaultValue={item.client}
                                          className={styles.input}
                                        />
                                      </div>
                                      <div className={styles.property}>
                                        <div className={styles.label}>
                                          Adresa
                                        </div>
                                        <input
                                          defaultValue={item.adresa}
                                          className={styles.input}
                                        />
                                      </div>
                                      <div className={styles.property}>
                                        <div className={styles.label}>
                                          Numar de telefon
                                        </div>
                                        <input
                                          defaultValue={item.telefon}
                                          className={styles.input}
                                        />
                                      </div>
                                      <div className={styles.property}>
                                        <div className={styles.label}>
                                          Statusul
                                        </div>
                                        <select
                                          className={styles.select}
                                          defaultValue={item.status}
                                        >
                                          <option
                                            className={styles.false}
                                            value="false"
                                          >
                                            In pregatire
                                          </option>
                                          <option
                                            className={styles.true}
                                            value="true"
                                          >
                                            Livrata
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className={styles.table}>
                                      <div className={styles.header}>
                                        <div className={styles.label}>Nume</div>
                                        <div className={styles.label}>
                                          Lungime
                                        </div>
                                        <div className={styles.label}>
                                          Latime
                                        </div>
                                        <div className={styles.label}>
                                          Grosime
                                        </div>
                                        <div className={styles.label}>
                                          Cantitate
                                        </div>
                                        <div className={styles.label}>Pret</div>
                                      </div>
                                      <div className={styles.body}>
                                        {item.produse &&
                                          item.produse.map((produs, index) => {
                                            return (
                                              <div>
                                                {width <= 850 && (
                                                  <h3
                                                    className={
                                                      styles.showNumberProduct
                                                    }
                                                  >
                                                    Produs {index + 1}
                                                  </h3>
                                                )}
                                                <div
                                                  className={styles.row}
                                                  key={index}
                                                >
                                                  <input
                                                    defaultValue={produs.nume}
                                                    className={styles.cell}
                                                  />
                                                  <input
                                                    defaultValue={
                                                      produs.lungime
                                                    }
                                                    className={styles.cell}
                                                  />
                                                  <input
                                                    defaultValue={produs.latime}
                                                    className={styles.cell}
                                                  />
                                                  <input
                                                    defaultValue={
                                                      produs.grosime
                                                    }
                                                    className={styles.cell}
                                                  />
                                                  <input
                                                    defaultValue={
                                                      produs.cantitate
                                                    }
                                                    className={styles.cell}
                                                  />
                                                  <input
                                                    defaultValue={produs.pret}
                                                    className={styles.cell}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.footer}>
                                    <div className={styles.saveEdit}>
                                      Salveaza
                                    </div>
                                    <div
                                      onClick={() => {
                                        deleteComanda(item.id);
                                      }}
                                      className={styles.deleteEdit}
                                    >
                                      Sterge Comanda
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
