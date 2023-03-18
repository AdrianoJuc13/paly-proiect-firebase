import TopNav from "../TopNav/TopNav";
import styles from "./Layout.module.scss";
import { Timestamp } from "firebase/firestore";

function formatDateTime(input) {
  var epoch = new Date(0);
  epoch.setSeconds(parseInt(input + 3600));
  var date = epoch.toISOString();
  date = date.replace("T", " ");
  return date.split(".")[0].split(" ")[0];
}
export default function Layout({ children }) {
  return (
    <div className={styles.full}>
      <div className={styles.topNav}>{<TopNav />}</div>
      <div className={styles.time}>
        Data de azi: {formatDateTime(Timestamp.now().seconds)}
      </div>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
