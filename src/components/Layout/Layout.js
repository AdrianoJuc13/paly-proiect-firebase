import TopNav from "../TopNav/TopNav";
import styles from "./Layout.module.scss";
export default function Layout({ children }) {
  return (
    <div className={styles.full}>
      {<TopNav />}
      <main>{children}</main>
    </div>
  );
}
