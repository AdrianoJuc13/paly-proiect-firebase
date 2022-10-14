import TopNav from "../TopNav/TopNav";
import styles from "./Layout.module.scss";
export default function Layout({ children }) {
  return (
    <div className={styles.full}>
      <div className={styles.navbar}>{<TopNav />}</div>
      <main className={styles.screen}>{children}</main>
    </div>
  );
}
