import Link from 'next/link';
import styles from '../../styles/auth.module.css';

export default function Sign_in() {
    return (
        <div className={styles.container}>
            <div className={styles.contentBigTitle}>
                <h1>social-network</h1>
                <p>Connect with friends and the world around you on social-network.</p>
            </div>
            <form className={`${styles.form} ${styles.formSignin}`}>
                <p className={styles.title}>Signin</p>
                <p className={styles.message}>Signin now and get full access to our app.</p>
                <label>
                    <i className="fa-solid fa-star-of-life"></i><span>Email</span>
                    <input className={styles.input} type="email" placeholder="Ex: jonedoe@gmail.com" required="" />
                </label>

                <label>
                    <i className="fa-solid fa-star-of-life"></i><span>Password</span>
                    <input className={styles.input} type="password" required="" />
                </label>

                <Link href='/home' className={styles.submit}>Submit</Link>
                <p className={styles.signin}>Already have an acount ? <Link href="/signup">Signup</Link></p>
            </form>
        </div>
    );
}