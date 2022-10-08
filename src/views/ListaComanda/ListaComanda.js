import { useState, useEffect } from "react";
import { database } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import styles from "./ListaComanda.module.scss";
import Layout from "../../components/Layout/Layout";
export default function ListaComanda() {
  const dbInstance = collection(database, "Comenzi");
  // const [deschidereComanda, setDeschidereComanda] = useState(true);
  const [comanda, setComanda] = useState([]);
  const getComanda = () => {
    getDocs(dbInstance).then((data) => {
      setComanda(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
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
  }, []);

  return (
    <Layout>
      <div className={styles.screen}>
        <div className={styles.container1}>
          <button className={styles.buttonMenu}>{`< MENU`}</button>
          <button className={styles.searchField}>Search</button>
        </div>
        <div className={styles.container2}>Lista Comenzi</div>
        <div className={styles.container3}>
          <div className={styles.headerContainer}>
            <div>Comenzi</div>
            <div>Listare dupa</div>
          </div>
          <div className={styles.headerComanda}>
            <div className={styles.headerComandaChild}>Clientul</div>
            <div className={styles.headerComandaChild}>Adresa</div>
            <div className={styles.headerComandaChild}>ID-ul comenzi</div>
            <div className={styles.headerComandaChild}>Statusul</div>
            <div className={styles.headerComandaChild}>Date de procesare</div>
            <div className={styles.headerComandaChild}>Remove</div>
          </div>
          <div>
            {comanda &&
              comanda.map((item) => {
                return (
                  <div key={item.id} className={styles.Comanda}>
                    <div className={styles.inchisComanda}>
                      <div className={styles.comandaClient}>{item.client}</div>
                      <div className={styles.comandaAdresa}>{item.adresa}</div>
                      <div className={styles.comandaId}>{item.id}</div>
                      <div
                        className={styles.comandaStatus}
                        style={
                          item.status
                            ? {
                                background: "#6CAD55",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }
                            : {
                                background: "rgba(221, 3, 3, 0.75)",
                                cursor: "pointer",
                                borderRadius: "5px",
                                padding: "5px",
                              }
                        }
                      >
                        {item.status ? "Livrata" : "In pregatire"}
                      </div>
                      <div className={styles.comandaProcesare}>
                        {item.dataProcess}
                      </div>
                      <div
                        className={styles.removeBtn}
                        onClick={() => {
                          deleteComanda(item.id);
                        }}
                      >
                        Delete Comanda
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// {deschidereComanda ? (
//   <div className={styles.deschisComanda}>
//     <table className={styles.table}>
//       <thead className={styles.tableHead}>
//         <tr>
//           <th className={styles.tablecell}>Clientul</th>
//           <th className={styles.tablecell}>Adresa</th>
//           <th className={styles.tablecell}>ID-ul comenzi</th>
//           <th className={styles.tablecell}>Status</th>
//           <th className={styles.tablecell}>Date procesare</th>
//         </tr>
//       </thead>
//       <tbody>
//         {comanda &&
//           comanda.map((item) => {
//             return (
//               <tr key={item.id}>
//                 <td className={styles.tablecell}>{item.client}</td>
//                 <td className={styles.tablecell}>{item.adresa}</td>
//                 <td className={styles.tablecell}>{item.id}</td>
//                 <td
//                   className={styles.tablecell}
//                   style={
//                     item.status
//                       ? {
//                           background: "#6CAD55",
//                           cursor: "pointer",
//                           borderRadius: "5px",
//                         }
//                       : {
//                           background: "rgba(221, 3, 3, 0.75)",
//                           cursor: "pointer",
//                           borderRadius: "5px",
//                           padding: "5px",
//                         }
//                   }
//                 >
//                   {item.status ? "Livrata" : "In pregatire"}
//                 </td>
//                 <td className={styles.tablecell}>
//                   {item.dataProcess}
//                 </td>
//               </tr>
//             );
//           })}
//       </tbody>
//     </table>
//   </div>
// ) : null}
