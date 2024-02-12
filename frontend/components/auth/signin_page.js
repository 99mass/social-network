import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../../styles/modules/auth.module.css";
import { api } from "../../utils/api";
import { sendData } from "../../handler/auth";

export default function Sign_in() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
   
    sendData(api.Login, jsonData, router, "home", setErrorMessage, true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentBigTitle}>
        <h1>social-network</h1>
        <p>Connect with friends and the world around you on social-network.</p>
      </div>
      <form
        method="post"
        onSubmit={handleSubmit}
        className={`${styles.form} ${styles.formSignin}`}
      >
        <p className={styles.title}>Signin</p>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <p className={styles.message}>
          Signin now and get full access to our app.
        </p>
        <label>
          <i className="fa-solid fa-star-of-life"></i>
          <span>Email</span>
          <input
            name="Email"
            className={styles.input}
            type="email"
            placeholder="Ex: jonedoe@gmail.com"
            required=""
          />
        </label>

        <label>
          <i className="fa-solid fa-star-of-life"></i>
          <span>Password</span>
          <input
            name="Password"
            className={styles.input}
            type="password"
            required=""
          />
        </label>
        <button type="submit" className={styles.submit}>
          Submit
        </button>
        <p className={styles.signin}>
          Already have an acount ? <Link href="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
