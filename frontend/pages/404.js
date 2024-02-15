import Link from "next/link";
import styles from "../styles/modules/page404.module.css"

export default function Custom404() {
    return (
        <div id={styles.notfound}>
        <div className={styles.notfound}>
            <div className={styles.notfound404}>
                <h3>Oops! Page not found</h3>
                <h1><span>4</span><span>0</span><span>4</span></h1>
            </div>
            <h2>we're sorry, but the page you requested could not be found</h2>
            {/* <Link href="/home">Go back</Link> */}
        </div>
    </div>
    );
  }