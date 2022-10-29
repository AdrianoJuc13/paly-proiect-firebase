import { useState, useEffect } from "react";
import { database } from "../../firebaseConfig";
import { collection, deleteDoc, doc, Timestamp } from "firebase/firestore";

import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import { motion } from "framer-motion";
import { CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import useWindowDimensions from "../../assets/hooks/useWindowDimensions";
import { toast } from "react-toastify";

export default function ListaComanda() {
  const dbInstance = collection(database, "Comenzi");
  // const [deschidereComanda, setDeschidereComanda] = useState(true);
  const [comanda, setComanda] = useState([]);
  const [comandaEdit, setComandaEdit] = useState([]);
  const [deschis, setDeschis] = useState(0);
  const [editeaza, setEditeaza] = useState(false);
  const [comandaFiltrata, setComandaFiltrata] = useState(comanda);
  const [comandaFiltrataInit, setComandaFiltrataInit] = useState(false);
  const [sorted, setSorted] = useState("asc");

  const handleChange = (event) => {
    setSorted(event.target.value);
  };

  const { width } = useWindowDimensions();

  // Functiile pentru Editare---------------------------------------------

  const submitEdit = async (id) => {
    try {
      database
        .collection("Comenzi")
        .doc(id)
        .update(comandaEdit)
        .then(() => {
          setEditeaza(false);
          setDeschis(0);
        });
      toast.success("A fost actualizata cu success");
    } catch (err) {
      console.log(err);
      toast.error("Nu a  putut fi actualizata comanda.Incearca din nou");
    }
  };
  const handleDeleteRow = async (index) => {
    comandaEdit.produse.splice(index, 1);
    setComandaEdit(comandaEdit);
    getComanda();
  };
  const handleAddRow = () => {
    comandaEdit.produse.push({
      nume: "",
      lungime: "",
      latime: "",
      grosime: "",
      cantitate: "",
      pret: "",
    });
    setComandaEdit(comandaEdit);
    getComanda();
  };
  // Functiile pentru Editare---------------------------------------------

  function formatDateTime(input) {
    var epoch = new Date(0);
    epoch.setSeconds(parseInt(input));
    var date = epoch.toISOString();
    date = date.replace("T", " ");
    return (
      date.split(".")[0].split(" ")[0] +
      " " +
      epoch.toLocaleTimeString().split(" ")[0]
    );
  }

  let timeAngajat = Timestamp.now().seconds - 604800;
  let timeBoss = Timestamp.now().seconds - 2630000;

  const getComanda = async () => {
    const createdAt = await database
      .collection("Comenzi")
      .orderBy("createdAt", sorted)
      .startAt(timeBoss)
      .get();
    setComanda(createdAt.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const deleteComanda = async (id) => {
    try {
      const todoRef = doc(dbInstance, id);
      await deleteDoc(todoRef).then(() => {
        setEditeaza(0);
        setDeschis(0);
        getComanda();
        toast.success("Comanda a fost stearsa cu success");
      });
    } catch (err) {
      console.log(err);
      toast.error("Nu s-a putut sterge comanda.Incercati din nou");
    }
  };

  useEffect(() => {
    getComanda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted]);

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
                // console.log(comandaFiltrata);
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

          {width >= 800 && (
            <div className={styles.headerComanda}>
              <div className={styles.headerComandaChild}>Clientul</div>
              <div className={styles.headerComandaChild}>Adresa</div>
              <div className={styles.headerComandaChild}>Data crearii</div>
              <div className={styles.headerComandaChild}>Numar de telefon</div>
              <div className={styles.headerComandaChild}>Statusul</div>
            </div>
          )}

          <div>
            {comanda &&
              (comandaFiltrataInit ? comandaFiltrata : comanda).map(
                (item, index) => {
                  console.log(item);
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
                          {width <= 850 && (
                            <div className={styles.firstC}>Client:</div>
                          )}
                          <div className={styles.secondC}>{item.client}</div>
                        </div>
                        <div className={`${styles.comandaItem}`}>
                          {width <= 850 && (
                            <div className={styles.firstC}>Adresa:</div>
                          )}
                          <div className={styles.secondC}>{item.adresa}</div>
                        </div>
                        <div className={`${styles.comandaItem}`}>
                          {width <= 850 && (
                            <div className={styles.firstC}>Data crearii:</div>
                          )}
                          <div className={styles.secondC}>
                            {item.createdAt && formatDateTime(item.createdAt)}
                          </div>
                        </div>
                        <div className={`${styles.comandaItem}`}>
                          {width <= 850 && (
                            <div className={styles.firstC}>Client:</div>
                          )}
                          <div className={styles.secondC}>{item.telefon}</div>
                        </div>
                        <div
                          className={styles.comandaStatus}
                          style={
                            item.status === "true"
                              ? {
                                  background: "#6CAD55",
                                }
                              : {
                                  background: "rgba(221, 3, 3, 0.75)",
                                }
                          }
                        >
                          {item.status === "true" ? "Livrata" : "In pregatire"}
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

                              {item.produse &&
                                item.produse.map((produs, index) => {
                                  return (
                                    <div>
                                      <div>
                                        <div
                                          key={index}
                                          className={styles.randProdus}
                                        >
                                          {width <= 850 && (
                                            <h5>{`Produs ${index + 1}`}</h5>
                                          )}
                                          <div className={styles.produs}>
                                            {width <= 850 && (
                                              <div className={styles.firstC}>
                                                Nume:
                                              </div>
                                            )}
                                            <div className={styles.secondC}>
                                              {produs.nume}
                                            </div>
                                          </div>
                                          <div className={styles.produs}>
                                            {width <= 850 && (
                                              <div className={styles.firstC}>
                                                Lungime:
                                              </div>
                                            )}
                                            <div className={styles.secondC}>
                                              {produs.lungime}
                                            </div>
                                          </div>
                                          <div className={styles.produs}>
                                            {width <= 850 && (
                                              <div className={styles.firstC}>
                                                Latime:
                                              </div>
                                            )}
                                            <div className={styles.secondC}>
                                              {produs.latime}
                                            </div>
                                          </div>
                                          <div className={styles.produs}>
                                            {width <= 850 && (
                                              <div className={styles.firstC}>
                                                Grosime:
                                              </div>
                                            )}
                                            <div className={styles.secondC}>
                                              {produs.grosime}
                                            </div>
                                          </div>
                                          <div className={styles.produs}>
                                            {width <= 850 && (
                                              <div className={styles.firstC}>
                                                Cantitate:
                                              </div>
                                            )}
                                            <div className={styles.secondC}>
                                              {produs.cantitate}
                                            </div>
                                          </div>
                                          <div className={styles.produs}>
                                            {width <= 850 && (
                                              <div className={styles.firstC}>
                                                Pret:
                                              </div>
                                            )}
                                            <div className={styles.secondC}>
                                              {produs.pret}
                                            </div>
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
                                  setEditeaza(true);
                                  setComandaEdit(comanda[index]);
                                }}
                              >
                                Editeaza Comanda
                              </motion.div>

                              {editeaza && (
                                <div className={styles.editPage}>
                                  <div className={styles.editScreen}>
                                    <div
                                      className={styles.titluEditeaza_closeBtn}
                                    >
                                      <div className={styles.titluEditeaza}>
                                        {`Editeaza Comanda`}
                                      </div>
                                      <div
                                        className={styles.closeBtn}
                                        onClick={() => {
                                          getComanda();
                                          setEditeaza(false);
                                        }}
                                      >
                                        <CloseCircleOutlined />
                                      </div>
                                    </div>

                                    <div className={styles.form}>
                                      <div className={styles.headerValues}>
                                        <div className={styles.property}>
                                          <div className={styles.label}>
                                            Numele Clientului
                                          </div>
                                          <input
                                            className={styles.input}
                                            value={comandaEdit.client}
                                            onChange={(e) => {
                                              const obj = comandaEdit;
                                              obj.client = e.target.value;
                                              setComandaEdit(obj);
                                              console.log(comandaEdit.client);
                                            }}
                                          />
                                        </div>

                                        <div className={styles.property}>
                                          <div className={styles.label}>
                                            Adresa
                                          </div>
                                          <input
                                            defaultValue={comandaEdit.adresa}
                                            className={styles.input}
                                            onChange={(value) => {
                                              comandaEdit.adresa =
                                                value.target.value;
                                            }}
                                          />
                                        </div>

                                        <div className={styles.property}>
                                          <div className={styles.label}>
                                            Numar de telefon
                                          </div>
                                          <input
                                            defaultValue={comandaEdit.telefon}
                                            className={styles.input}
                                            onChange={(value) => {
                                              comandaEdit.telefon =
                                                value.target.value;
                                            }}
                                          />
                                        </div>

                                        <div className={styles.property}>
                                          <div className={styles.label}>
                                            Creata la data:
                                          </div>
                                          <div className={styles.input}>
                                            {item.createdAt &&
                                              formatDateTime(item.createdAt)}
                                          </div>
                                        </div>

                                        <div className={styles.property}>
                                          <div className={styles.label}>
                                            Statusul
                                          </div>
                                          <select
                                            className={styles.select}
                                            defaultValue={comandaEdit.status}
                                            onChange={(value) => {
                                              comandaEdit.status =
                                                value.target.value;
                                            }}
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
                                          <div className={styles.label}>
                                            Nume
                                          </div>
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
                                          <div className={styles.label}>
                                            Pret
                                          </div>
                                          <div className={styles.labelDelete}>
                                            Delete
                                          </div>
                                        </div>

                                        <div className={styles.body}>
                                          {comandaEdit.produse &&
                                            comandaEdit.produse.map(
                                              (produs, index) => {
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
                                                    {
                                                      //Start Products Table---------------------------------------------
                                                    }
                                                    <div
                                                      className={styles.row}
                                                      key={index}
                                                    >
                                                      {
                                                        //Nume---------------------------------------------
                                                      }
                                                      <div
                                                        className={
                                                          styles.inputTransform
                                                        }
                                                      >
                                                        {width <= 850 && (
                                                          <div
                                                            className={
                                                              styles.titluCell
                                                            }
                                                          >
                                                            Nume
                                                          </div>
                                                        )}
                                                        <input
                                                          defaultValue={
                                                            produs.nume
                                                          }
                                                          className={
                                                            styles.cell
                                                          }
                                                          onChange={(e) => {
                                                            comandaEdit.produse[
                                                              index
                                                            ].nume =
                                                              e.target.value;
                                                            console.log(
                                                              comandaEdit
                                                                .produse[0].nume
                                                            );
                                                          }}
                                                        />
                                                      </div>

                                                      {
                                                        //Lungime---------------------------------------------
                                                      }
                                                      <div
                                                        className={
                                                          styles.inputTransform
                                                        }
                                                      >
                                                        {width <= 850 && (
                                                          <div
                                                            className={
                                                              styles.titluCell
                                                            }
                                                          >
                                                            Lungime
                                                          </div>
                                                        )}
                                                        <input
                                                          className={
                                                            styles.cell
                                                          }
                                                          defaultValue={
                                                            produs.lungime
                                                          }
                                                          onChange={(e) => {
                                                            comandaEdit.produse[
                                                              index
                                                            ].lungime =
                                                              e.target.value;
                                                          }}
                                                        />
                                                      </div>

                                                      {
                                                        //Latime---------------------------------------------
                                                      }
                                                      <div
                                                        className={
                                                          styles.inputTransform
                                                        }
                                                      >
                                                        {width <= 850 && (
                                                          <div
                                                            className={
                                                              styles.titluCell
                                                            }
                                                          >
                                                            Latime
                                                          </div>
                                                        )}
                                                        <input
                                                          defaultValue={
                                                            produs.latime
                                                          }
                                                          className={
                                                            styles.cell
                                                          }
                                                          onChange={(e) => {
                                                            comandaEdit.produse[
                                                              index
                                                            ].latime =
                                                              e.target.value;
                                                          }}
                                                        />
                                                      </div>

                                                      {
                                                        //Grosime---------------------------------------------
                                                      }
                                                      <div
                                                        className={
                                                          styles.inputTransform
                                                        }
                                                      >
                                                        {width <= 850 && (
                                                          <div
                                                            className={
                                                              styles.titluCell
                                                            }
                                                          >
                                                            Grosime
                                                          </div>
                                                        )}
                                                        <input
                                                          defaultValue={
                                                            produs.grosime
                                                          }
                                                          className={
                                                            styles.cell
                                                          }
                                                          onChange={(e) => {
                                                            comandaEdit.produse[
                                                              index
                                                            ].grosime =
                                                              e.target.value;
                                                          }}
                                                        />
                                                      </div>

                                                      {
                                                        //Cantitate---------------------------------------------
                                                      }
                                                      <div
                                                        className={
                                                          styles.inputTransform
                                                        }
                                                      >
                                                        {width <= 850 && (
                                                          <div
                                                            className={
                                                              styles.titluCell
                                                            }
                                                          >
                                                            Cantitate
                                                          </div>
                                                        )}
                                                        <input
                                                          defaultValue={
                                                            produs.cantitate
                                                          }
                                                          className={
                                                            styles.cell
                                                          }
                                                          onChange={(e) => {
                                                            comandaEdit.produse[
                                                              index
                                                            ].cantitate =
                                                              e.target.value;
                                                          }}
                                                        />
                                                      </div>

                                                      {
                                                        //Pret---------------------------------------------
                                                      }
                                                      <div
                                                        className={
                                                          styles.inputTransform
                                                        }
                                                      >
                                                        {width <= 850 && (
                                                          <div
                                                            className={
                                                              styles.titluCell
                                                            }
                                                          >
                                                            Pret
                                                          </div>
                                                        )}
                                                        <input
                                                          defaultValue={
                                                            produs.pret
                                                          }
                                                          className={
                                                            styles.cell
                                                          }
                                                          onChange={(e) => {
                                                            comandaEdit.produse[
                                                              index
                                                            ].pret =
                                                              e.target.value;
                                                          }}
                                                        />
                                                      </div>

                                                      {
                                                        //Delete Button---------------------------------------------
                                                      }
                                                      <div
                                                        className={
                                                          styles.deleteRowBtn
                                                        }
                                                        onClick={() => {
                                                          handleDeleteRow(
                                                            index
                                                          );
                                                        }}
                                                      >
                                                        <DeleteOutlined />
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className={styles.footer}>
                                      {
                                        //Button de salvat editarile---------------------------------------------
                                      }
                                      <div
                                        onClick={() => {
                                          submitEdit(item.id);
                                        }}
                                        className={styles.saveEdit}
                                      >
                                        Salveaza
                                      </div>
                                      {
                                        //Button de adaugat randuri la tabel---------------------------------------------
                                      }
                                      <div
                                        className={styles.addEdit}
                                        onClick={() => {
                                          handleAddRow(item.id);
                                        }}
                                      >
                                        Adauga Produs
                                      </div>
                                      {
                                        //Buton de stergere a comenzii---------------------------------------------
                                      }
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
                              )}
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
