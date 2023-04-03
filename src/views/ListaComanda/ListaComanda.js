import { useState, useEffect } from "react";
import { database, firebase } from "../../firebaseConfig";
import { collection, deleteDoc, doc, Timestamp } from "firebase/firestore";

import styles from "./styles.module.scss";
import Layout from "../../components/Layout/Layout";
import { motion } from "framer-motion";
import {
  CloseCircleOutlined,
  // DeleteOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import useWindowDimensions from "../../assets/hooks/useWindowDimensions";
import { toast } from "react-toastify";
// import { v4 as uuidv4 } from "uuid";
import PDF from "./PDF";

export default function ListaComanda() {
  const dbInstance = collection(database, "Comenzi");
  // const [deschidereComanda, setDeschidereComanda] = useState(true);
  const [comanda, setComanda] = useState([]);
  const [comandaEdit, setComandaEdit] = useState([]);
  const [deschis, setDeschis] = useState(0);
  const [editeaza, setEditeaza] = useState(false);
  const [comandaFiltrata, setComandaFiltrata] = useState(comanda);
  const [comandaFiltrataInit, setComandaFiltrataInit] = useState(false);
  const [sorted] = useState("desc");
  const [angajat, setAngajat] = useState(false);
  const [pdfView, setPdfView] = useState(false);
  const [transa, setTransa] = useState(0);

  let maxdate = 13;
  let maxyear = 3000;

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

  // const handleChange = (event) => {
  //   setSorted(event.target.value);
  // };

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
  const achitataa = (obj) => {
    let i = 0;
    let sumcalcul = 0;
    // console.log(obj);

    for (i = 0; i < obj.produse.length; i++)
      sumcalcul += parseInt(obj.produse[i].Calcul)
        ? parseInt(obj.produse[i].Calcul)
        : 0;

    let sumplati = 0;
    for (i = 0; i < obj.transe.length; i++)
      sumplati += parseInt(obj.transe[i]) ? parseInt(obj.transe[i]) : 0;

    return sumcalcul - sumplati;
  };

  const submitEdit = async (id) => {
    const newComandaEdit = comandaEdit;
    newComandaEdit.produse = inputFields;
    if (transa) {
      newComandaEdit.transe[newComandaEdit.transe.length] = transa;
      if (achitataa(newComandaEdit) <= 0) newComandaEdit.status = true;
      setTransa(0);
    }
    setComandaEdit(newComandaEdit);
    try {
      database
        .collection("Comenzi")
        .doc(id)
        .update({
          client: comandaEdit.client,
          adresa: comandaEdit.adresa,
          status: comandaEdit.status,
          status2: comandaEdit.status2,
          telefon: comandaEdit.telefon,
          transe: comandaEdit.transe,
          produse: inputFields,
          ridicata: comandaEdit.ridicata,
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
  // const handleRemoveFields = (id) => {
  //   const values = [...inputFields];
  //   values.splice(
  //     values.findIndex((value) => value.id === id),
  //     1
  //   );
  //   setInputFields(values);
  // };
  // const handleAddFields = () => {
  //   setInputFields([
  //     ...inputFields,
  //     {
  //       id: uuidv4(),
  //       Material: "",
  //       MP: "",
  //       ML: "",
  //       Calcul: "",
  //     },
  //   ]);
  // };
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
  function getsomeDate(input) {
    var epoch = new Date(0);
    epoch.setSeconds(parseInt(input));

    if (maxyear !== epoch.getFullYear()) {
      maxyear = parseInt(epoch.getFullYear());
      // console.log(epoch.getFullYear());
      maxdate = epoch.getMonth();
      return true;
    }
    // return false;
    if (maxdate === epoch.getMonth()) {
      return false;
    } else {
      maxdate = epoch.getMonth();
      // maxdate = 13;
      return true;
    }
  }

  function showYMonth(input) {
    var epoch = new Date(0);
    epoch.setSeconds(parseInt(input));
    let year = epoch.getFullYear();
    var months = [
      "Ianuarie",
      "Februarie",
      "Martie",
      "Aprilie",
      "Mai",
      "Iunie",
      "Iulie",
      "August",
      "Septembrie",
      "Octombrie",
      "Noiembrie",
      "Decembrie",
    ];
    let month = epoch.getMonth();
    return `${year} ${months[month]}`;
  }

  let timeAngajat = Timestamp.now().seconds - 2592000;

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

  function getTotal(index) {
    var total = 0;
    comanda[index].produse &&
      comanda[index].produse.map((item) => {
        total += parseInt(item.Calcul) ? parseInt(item.Calcul) : 0;
        return null;
      });
    return total;
  }

  function getRest(index) {
    var total = 0;
    // console.log(comanda[index].produse);
    comanda[index].transe &&
      comanda[index].transe.map((item) => {
        total += parseInt(item) > 0 ? parseInt(item) : 0;
        return null;
      });
    return getTotal(index) - total > 0 ? getTotal(index) - total : 0;
  }
  function getPlatit(index) {
    var total = 0;
    // console.log(comanda[index].produse);
    comanda[index].transe &&
      comanda[index].transe.map((item) => {
        total += parseInt(item) > 0 ? parseInt(item) : 0;
        return null;
      });
    return total > 0 ? total : 0;
  }

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
              {angajat === true ? "Comenzi in ultimele 30 zile:" : "Comenzi"}{" "}
              {comanda.length}
            </div>
            {/* <select
              className="form-select form-select-sm w-20"
              aria-label=".form-select-sm example"
              onChange={handleChange}
            >
              <option select="true" value="asc">
                Crescator
              </option>
              <option value="desc">Descrescator</option>
            </select> */}
          </div>
          {width >= 800 && (
            <div className={styles.headerComanda}>
              <div className={styles.headerComandaChild}>Clientul</div>
              <div className={`${styles.headerComandaChild}`}>Adresa</div>

              <div className={`${styles.headerComandaChild}`}>
                Numar de telefon
              </div>
              <div className={`${styles.headerComandaChild}`}>Total</div>
              <div className={`${styles.headerComandaChild}`}>Platit</div>
              <div className={`${styles.headerComandaChild}`}>
                Rest de plata
              </div>
              <div className={styles.headerComandaChild}>Statusul plata</div>
              <div className={styles.headerComandaChild}>Statusul comanda</div>
            </div>
          )}
          <div>
            {comanda &&
              (comandaFiltrataInit ? comandaFiltrata : comanda).map(
                (item, index) => {
                  return (
                    <div className="divprincipal" key={item.id}>
                      <div style={{ fontSize: "20px" }}>
                        {getsomeDate(item.createdAt) ? (
                          <div
                            style={{
                              display: "flex",
                              background:
                                "linear-gradient(45deg,white,white,rgba(0, 0, 0, 0.2),white,white)",
                              justifyContent: "center",
                              alignItems: "center",
                              color: "rgba(0,0,0,0.6)",
                              height: "25px",
                              fontWeight: "bolder",
                              fontSize: "16px",
                              marginTop: "16px",
                            }}
                          >
                            {showYMonth(item.createdAt)}
                          </div>
                        ) : null}
                      </div>
                      <div className={styles.Comanda}>
                        <div
                          className={styles.headerField}
                          onClick={() => {
                            deschis === item.id
                              ? setDeschis(0)
                              : setDeschis(item.id);
                          }}
                        >
                          <div className={`${styles.comandaItem}`}>
                            {width <= 850 && (
                              <div className={styles.firstC}>Client:</div>
                            )}
                            <div className={styles.secondC}>
                              {item.client ? item.client : "-"}
                            </div>
                          </div>
                          <div className={`${styles.comandaItem}`}>
                            {width <= 850 && (
                              <div className={styles.firstC}>Adresa:</div>
                            )}
                            <div className={styles.secondC}>
                              {item.adresa ? item.adresa : "-"}
                            </div>
                          </div>
                          {/*                         
                        <div className={`${styles.comandaItem}`}>
                          {width <= 850 && (
                            <div className={styles.firstC}>Data crearii:</div>
                          )}
                          <div className={styles.secondC}>
                            {item.createdAt && formatDateTime(item.createdAt)}
                          </div>
                        </div> 
                        */}

                          <div className={`${styles.comandaItem}`}>
                            {width <= 850 && (
                              <div className={styles.firstC}>Telefon:</div>
                            )}
                            <div className={styles.secondC}>
                              {item.telefon ? item.telefon : "-"}
                            </div>
                          </div>

                          <div className={`${styles.comandaItem}`}>
                            {width <= 850 && (
                              <div className={styles.firstC}>Total:</div>
                            )}
                            <div className={styles.secondC}>
                              {getTotal(index) ? getTotal(index) : "-"}
                            </div>
                          </div>
                          <div className={`${styles.comandaItem}`}>
                            {width <= 850 && (
                              <div className={styles.firstC}>Avans:</div>
                            )}
                            <div className={styles.secondC}>
                              {getPlatit(index)}
                            </div>
                          </div>
                          <div className={`${styles.comandaItem}`}>
                            {width <= 850 && (
                              <div className={styles.firstC}>
                                Rest de plata:
                              </div>
                            )}
                            <div className={styles.secondC}>
                              {getRest(index)}
                            </div>
                          </div>
                          <div
                            className={`${styles.comandaItem}`}
                            style={
                              item.status === true
                                ? {
                                    background: "rgba(7, 188, 12, 1)",
                                    color: "white",

                                    display: "flex",
                                    justifyContent: "center",
                                  }
                                : {
                                    background: "rgba(255, 0, 0, 1)",
                                    color: "white",

                                    display: "flex",
                                    justifyContent: "center",
                                  }
                            }
                          >
                            {item.status === true ? "Achitata" : "Neachitata"}
                          </div>

                          <div
                            className={styles.comandaItem}
                            style={
                              item.status2 === "true"
                                ? {
                                    background: "rgba(7, 188, 12, 1)",
                                    color: "white",

                                    display: "flex",
                                    justifyContent: "center",
                                  }
                                : {
                                    background: "rgba(0, 0, 73, 0.81)",
                                    color: "white",

                                    display: "flex",
                                    justifyContent: "center",
                                  }
                            }
                          >
                            {item.status2 === "true"
                              ? "Ridicata"
                              : "Transcrisa"}
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
                                      Material
                                    </div>
                                    <div className={styles.produsTitlu}>MP</div>
                                    <div className={styles.produsTitlu}>ML</div>
                                    <div className={styles.produsTitlu}>
                                      Calcul
                                    </div>
                                  </div>
                                )}

                                {item.produse &&
                                  item.produse.map((produs, index) => {
                                    return (
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
                                              Material:
                                            </div>
                                          )}
                                          <div className={styles.secondC}>
                                            {produs.Material
                                              ? produs.Material
                                              : "-"}
                                          </div>
                                        </div>
                                        <div className={styles.produs}>
                                          {width <= 850 && (
                                            <div className={styles.firstC}>
                                              MP:
                                            </div>
                                          )}
                                          <div className={styles.secondC}>
                                            {produs.MP ? produs.MP : "-"}
                                          </div>
                                        </div>
                                        <div className={styles.produs}>
                                          {width <= 850 && (
                                            <div className={styles.firstC}>
                                              ML:
                                            </div>
                                          )}
                                          <div className={styles.secondC}>
                                            {produs.ML ? produs.ML : "-"}
                                          </div>
                                        </div>
                                        <div className={styles.produs}>
                                          {width <= 850 && (
                                            <div className={styles.firstC}>
                                              Calcul:
                                            </div>
                                          )}
                                          <div className={styles.secondC}>
                                            {produs.Calcul
                                              ? produs.Calcul
                                              : "-"}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                <div className={styles.butoane}>
                                  <motion.div
                                    whileHover={{ scale: 1.01 }}
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
                                  <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.1 }}
                                    className={styles.printBtn}
                                    onClick={() => {
                                      setPdfView(!pdfView);
                                    }}
                                  >
                                    Printeaza comanda
                                  </motion.div>

                                  {pdfView ? (
                                    <div className={styles.backscreenPdf}>
                                      <PDF obj={comanda[index]} />
                                      <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.1 }}
                                        className={styles.inchidePrinteaza}
                                        onClick={() => {
                                          setPdfView(!pdfView);
                                        }}
                                      >
                                        <CloseSquareOutlined />
                                      </motion.div>
                                    </div>
                                  ) : null}
                                </div>
                                {editeaza && (
                                  <div className={styles.editPage}>
                                    <div className={styles.editScreen}>
                                      <div
                                        className={
                                          styles.titluEditeaza_closeBtn
                                        }
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
                                              disabled
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
                                              disabled
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
                                                obj.telefon =
                                                  value.target.value;
                                                setComandaEdit(obj);
                                              }}
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        <div className={styles.headerValues}>
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
                                              Status plata
                                            </div>
                                            <select
                                              disabled
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
                                                Neachitata
                                              </option>
                                              <option
                                                className={styles.true}
                                                value="true"
                                              >
                                                Achitata
                                              </option>
                                            </select>
                                          </div>

                                          <div className={styles.property}>
                                            <div className={styles.label}>
                                              Status comanda
                                            </div>
                                            <select
                                              disabled={
                                                comandaEdit.status2
                                                  ? true
                                                  : false
                                              }
                                              className={styles.select}
                                              defaultValue={comandaEdit.status2}
                                              onChange={(value) => {
                                                const obj = comandaEdit;
                                                obj.status2 =
                                                  value.target.value;
                                                obj.ridicata =
                                                  Timestamp.now().seconds;
                                                setComandaEdit(obj);
                                              }}
                                            >
                                              <option
                                                className={styles.false}
                                                value="false"
                                              >
                                                Transcrisa
                                              </option>
                                              <option
                                                className={styles.true}
                                                value="true"
                                              >
                                                Ridicata
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                        {item.status2 ? (
                                          <div className={styles.transe}>
                                            Ridicata la:{" "}
                                            {formatDateTime(item.ridicata)}
                                          </div>
                                        ) : null}
                                        <div className={styles.transe}>
                                          Plati:
                                          {comandaEdit.transe &&
                                            comandaEdit.transe.map(
                                              (item, index) => {
                                                return (
                                                  <div
                                                    key={index}
                                                    className={styles.transa}
                                                  >
                                                    {item}
                                                  </div>
                                                );
                                              }
                                            )}
                                          <input
                                            placeholder="plata noua"
                                            onChange={(value) => {
                                              setTransa(value.target.value);
                                            }}
                                          />
                                        </div>

                                        <div className={styles.table}>
                                          <div className={styles.header}>
                                            <div className={styles.label}>
                                              Material
                                            </div>
                                            <div className={styles.label}>
                                              MP
                                            </div>
                                            <div className={styles.label}>
                                              ML
                                            </div>
                                            <div className={styles.label}>
                                              Calcul
                                            </div>

                                            {/* <div className={styles.labelDelete}>
                                            Sterge
                                          </div> */}
                                          </div>
                                          <div className={styles.body}>
                                            {inputFields &&
                                              inputFields.map(
                                                (produs, index) => {
                                                  return (
                                                    <div key={index}>
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
                                                          //Material---------------------------------------------
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
                                                              Material
                                                            </div>
                                                          )}
                                                          <input
                                                            disabled
                                                            className={
                                                              styles.cell
                                                            }
                                                            name="Material"
                                                            placeholder="Material"
                                                            value={
                                                              produs.Material
                                                            }
                                                            onChange={(event) =>
                                                              handleChangeInput(
                                                                produs.id,
                                                                event
                                                              )
                                                            }
                                                          />
                                                        </div>

                                                        {
                                                          //Metri Patrati---------------------------------------------
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
                                                              MP
                                                            </div>
                                                          )}
                                                          <input
                                                            disabled
                                                            className={
                                                              styles.cell
                                                            }
                                                            name="MP"
                                                            placeholder="MP"
                                                            value={produs.MP}
                                                            onChange={(event) =>
                                                              handleChangeInput(
                                                                produs.id,
                                                                event
                                                              )
                                                            }
                                                          />
                                                        </div>

                                                        {
                                                          //Metri Liniari---------------------------------------------
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
                                                              ML
                                                            </div>
                                                          )}
                                                          <input
                                                            disabled
                                                            className={
                                                              styles.cell
                                                            }
                                                            placeholder="ML"
                                                            name="ML"
                                                            value={produs.ML}
                                                            onChange={(event) =>
                                                              handleChangeInput(
                                                                produs.id,
                                                                event
                                                              )
                                                            }
                                                          />
                                                        </div>

                                                        {
                                                          //Calcul---------------------------------------------
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
                                                              Calcul
                                                            </div>
                                                          )}
                                                          <input
                                                            disabled
                                                            className={
                                                              styles.cell
                                                            }
                                                            name="Calcul"
                                                            placeholder="Calcul"
                                                            value={
                                                              produs.Calcul
                                                            }
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
                                                        {/* <button
                                                      className={
                                                        styles.deleteRowBtn
                                                      }
                                                      disabled
                                                      // disabled={
                                                      //   inputFields.length === 1
                                                      // }
                                                      onClick={() =>
                                                        handleRemoveFields(
                                                          produs.id
                                                        )
                                                      }
                                                    >
                                                      <DeleteOutlined />
                                                    </button> */}
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
                                        {/* <div
                                        className={styles.addEdit}
                                        onClick={() => {
                                          handleAddFields(item.id);
                                        }}
                                      >
                                        Adauga Produs
                                      </div> */}
                                        {
                                          //Buton de stergere a comenzii---------------------------------------------
                                        }
                                        {angajat ? null : (
                                          <button
                                            onClick={() => {
                                              deleteComanda(item.id);
                                            }}
                                            disabled={angajat ? true : false}
                                            className={styles.deleteEdit}
                                          >
                                            Sterge Comanda
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </motion.div>
                      </div>
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
