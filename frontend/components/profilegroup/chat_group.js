import styles from "../../styles/modules/profile-group.module.css";
import { AboutGroup } from "./discussions";

export default function ChatGroup() {


  return (
    <div className={styles.contentPostAbout}>
      <div className={styles.blocLeft}>

      </div>
      <AboutGroup />
    </div>
  );
}
