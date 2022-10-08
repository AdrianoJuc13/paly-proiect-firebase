import styles from "../styles/Evernote.module.scss";
import { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function NoteOperations() {
  const dbInstance = collection(database, "notes");

  const [noteTitle, setNoteTitle] = useState("M");
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);

  const [notesArray, setNotesArray] = useState([]);

  const saveNote = () => {
    addDoc(dbInstance, {
      noteTitle: noteTitle,
      value1: value1,
      value2: value2,
    }).then(() => {
      getNotes();
    });
  };

  const getNotes = () => {
    getDocs(dbInstance).then((data) => {
      setNotesArray(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };
  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.listNote}>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          placeholder="Title"
          onChange={(e) => setNoteTitle(e.target.value)}
          type="text"
          value={noteTitle}
        />
        <input
          className={styles.input}
          placeholder="value 1"
          onChange={(e) => setValue1(e.target.value)}
          type="number"
          value={value1}
        />
        <input
          className={styles.input}
          placeholder="value 2"
          onChange={(e) => setValue2(e.target.value)}
          type="number"
          value={value2}
        />
        <button onClick={saveNote} className={styles.saveBtn}>
          Save
        </button>
      </div>

      <div>
        {notesArray &&
          notesArray.map((note) => {
            return (
              <div className={styles.notesInner} key={note.id}>
                {` are (${note.value1} cm)* (${note.value2}cm) = ${
                  note.value1 * note.value2
                }(cm^2)
              `}
              </div>
            );
          })}
      </div>
    </div>
  );
}
