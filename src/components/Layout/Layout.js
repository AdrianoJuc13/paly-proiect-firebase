import styles from "./Layout.module.scss";
export default function Layout({ children }) {
  return (
    <div>
      <div className={styles.full}>
        <div className={styles.navbar}>
          <a href="/">
            <button className={styles.button}>Dashboard</button>
          </a>
          <a href="/adaugaComanda">
            <button className={styles.button}>Comanda</button>
          </a>
        </div>
        <main className={styles.screen}>{children}</main>
      </div>
    </div>
  );
}
