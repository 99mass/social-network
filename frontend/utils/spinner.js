import styles from '../styles/modules/Spinner.module.css'

export function Loader() {
    return (
        <div className={`${styles.spinner} ${styles.center}`}>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
            <div className={styles.spinnerBlade}></div>
        </div>
    )
}