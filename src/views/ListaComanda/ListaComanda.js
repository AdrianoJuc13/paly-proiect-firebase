import { useState, useEffect } from "react";
import { database, firebase } from "../../firebaseConfig";
import { collection, deleteDoc, doc, Timestamp } from "firebase/firestore";

import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import { motion } from "framer-motion";
import { CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import useWindowDimensions from "../../assets/hooks/useWindowDimensions";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

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
  const [angajat, setAngajat] = useState(false);

  useEffect(() => {
    getComanda();
    isAngajat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted, angajat]);

  const isAngajat = async () => {
    const userId = await database.collection("Users").get();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (userId.docs[0].id === user.uid) {
          setAngajat(true);
        }
      } else {
        isAngajat();
      }
    });
  };

  const handleChange = (event) => {
    setSorted(event.target.value);
  };

  const { width } = useWindowDimensions();

  // Functiile pentru Editare---------------------------------------------
  const [inputFields, setInputFields] = useState([]);
  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });
    setInputFields(newInputFields);
  };

  const submitEdit = async (id) => {
    const newComandaEdit = comandaEdit;
    newComandaEdit.produse = inputFields;
    setComandaEdit(newComandaEdit);
    try {
      database
        .collection("Comenzi")
        .doc(id)
        .update({
          client: comandaEdit.client,
          adresa: comandaEdit.adresa,
          status: comandaEdit.status,
          telefon: comandaEdit.telefon,
          produse: inputFields,
        })
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
  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
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

  let timeAngajat = Timestamp.now().seconds - 104800;

  const getComanda = async () => {
    const createdAtAsc = await database
      .collection("Comenzi")
      .orderBy("createdAt", sorted)
      .startAt(angajat ? timeAngajat : 0)
      .get();

    const createdAtDesc = await database
      .collection("Comenzi")
      .orderBy("createdAt", sorted)
      .endAt(angajat ? timeAngajat : 0)
      .get();
    setComanda(
      (sorted === "asc" ? createdAtAsc : createdAtDesc).docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
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

  return (
    <Layout>
      <div className={styles.screen}>
        <div className={styles.container2}>Lista Comenzi</div>
        <div className={styles.searchField}>
          <div className="form-outline">
            <input
              type="search"
              id="form1"
              className="form-control text-black"
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
              }}
            />
          </div>
        </div>
        <div className={styles.container3}>
          <div className={styles.headerContainer}>
            <div className={styles.textHeaderContainer}>
              {angajat === true ? "Comenzi in ultimele 7 zile:" : "Comenzi"}{" "}
              {comanda.length}
            </div>
            <select
              className="form-select form-select-sm w-20"
              aria-label=".form-select-sm example"
              onChange={handleChange}
            >
              <option select="true" value="asc">
                Crescator
              </option>
              <option value="desc">Descrescator</option>
            </select>
          </div>

          {width >= 800 && (
            <div className={styles.headerComanda}>
              <div className={styles.headerComandaChild}>Clientul</div>
              <div
                className={`${styles.headerComandaChild} ${styles.paddingLeft}`}
              >
                Adresa
              </div>
              <div
                className={`${styles.headerComandaChild} ${styles.paddingData}`}
              >
                Data crearii
              </div>
              <div className={`${styles.headerComandaChild}`}>
                Numar de telefon
              </div>
              <div className={styles.headerComandaChild}>Statusul</div>
            </div>
          )}

          <div>
            {comanda &&
              (comandaFiltrataInit ? comandaFiltrata : comanda).map(
                (item, index) => {
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
                                  setInputFields(comanda[index].produse);
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
                                            defaultValue={comandaEdit.client}
                                            onChange={(value) => {
                                              const obj = comandaEdit;
                                              obj.client = value.target.value;
                                              setComandaEdit(obj);
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
                                              const obj = comandaEdit;
                                              obj.adresa = value.target.value;
                                              setComandaEdit(obj);
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
                                              const obj = comandaEdit;
                                              obj.telefon = value.target.value;
                                              setComandaEdit(obj);
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
                                              const obj = comandaEdit;
                                              obj.status = value.target.value;
                                              setComandaEdit(obj);
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
                                          {inputFields &&
                                            inputFields.map((produs, index) => {
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
                                                        className={styles.cell}
                                                        name="nume"
                                                        placeholder="nume"
                                                        value={produs.nume}
                                                        onChange={(event) =>
                                                          handleChangeInput(
                                                            produs.id,
                                                            event
                                                          )
                                                        }
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
                                                        className={styles.cell}
                                                        name="lungime"
                                                        placeholder="lungime"
                                                        value={produs.lungime}
                                                        onChange={(event) =>
                                                          handleChangeInput(
                                                            produs.id,
                                                            event
                                                          )
                                                        }
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
                                                        className={styles.cell}
                                                        placeholder="latime"
                                                        name="latime"
                                                        value={produs.latime}
                                                        onChange={(event) =>
                                                          handleChangeInput(
                                                            produs.id,
                                                            event
                                                          )
                                                        }
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
                                                        className={styles.cell}
                                                        name="grosime"
                                                        placeholder="grosime"
                                                        value={produs.grosime}
                                                        onChange={(event) =>
                                                          handleChangeInput(
                                                            produs.id,
                                                            event
                                                          )
                                                        }
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
                                                        className={styles.cell}
                                                        name="cantitate"
                                                        placeholder="cantitate"
                                                        value={produs.cantitate}
                                                        onChange={(event) =>
                                                          handleChangeInput(
                                                            produs.id,
                                                            event
                                                          )
                                                        }
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
                                                        className={styles.cell}
                                                        name="pret"
                                                        placeholder="pret"
                                                        value={produs.pret}
                                                        onChange={(event) =>
                                                          handleChangeInput(
                                                            produs.id,
                                                            event
                                                          )
                                                        }
                                                      />
                                                    </div>

                                                    {
                                                      //Delete Button---------------------------------------------
                                                    }
                                                    <div
                                                      className={
                                                        styles.deleteRowBtn
                                                      }
                                                      disabled={
                                                        inputFields.length === 1
                                                      }
                                                      onClick={() =>
                                                        handleRemoveFields(
                                                          produs.id
                                                        )
                                                      }
                                                    >
                                                      <DeleteOutlined />
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
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
                                          handleAddFields(item.id);
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
