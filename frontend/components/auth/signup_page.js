import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { convertAge } from "../../utils/convert_dates";
import { api } from "../../utils/api";
import { sendData } from "../../handler/auth";
import styles from "../../styles/modules/auth.module.css";

export default function Sign_up() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [imgeName, setImageName] = useState("Click to upload image");
  const fileInputRef = useRef(null);

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };
  const toggleImageName = () => {
    const _file = fileInputRef.current.files[0];
    if (_file) setImageName(_file.name);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jsonData = {};

    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    // Appel de la fonction pour convertire l'âge
    if (jsonData.DateOfBirth) {
      const dateOfBirth = new Date(jsonData.DateOfBirth);
      const age = convertAge(dateOfBirth);
      jsonData.DateOfBirth = age;
    }

    // recuperer le fichier le convertir en base64
    const file = fileInputRef.current.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64File = reader.result;
        jsonData.Avatarpath = base64File;
        console.log(jsonData);
        sendData(api.Registre, jsonData, router, "", setErrorMessage, false);
      };

      reader.readAsDataURL(file);
    } else {
      jsonData.Avatarpath = "";
      sendData(api.Registre, jsonData, router, "", setErrorMessage, false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentBigTitle}>
        <h1>social-network</h1>
        <p>Connect with friends and the world around you on social-network.</p>
      </div>
      <form
        method="post"
        className={`${styles.form} ${styles.formRegistre}`}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <p className={styles.title}>Register</p>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <p className={styles.message}>
          Signup now and get full access to our app.
        </p>

        <div className={styles.flex}>
          <label>
            <i className="fa-solid fa-star-of-life"></i>
            <span>Firstname</span>
            <input
              name="FirstName"
              className={styles.input}
              type="text"
              placeholder="Ex: Jone"
              required=""
            />
          </label>

          <label>
            <i className="fa-solid fa-star-of-life"></i>
            <span>Lastname</span>
            <input
              name="LastName"
              className={styles.input}
              type="text"
              placeholder="Ex: Doe"
              required=""
            />
          </label>
        </div>
        <label>
          <span>Nickname</span>
          <input
            name="Nickname"
            className={styles.input}
            type="text"
            placeholder="Ex: JDoe"
          />
        </label>
        <label>
          <i className="fa-solid fa-star-of-life"></i>
          <span>Date of Birth</span>
          <input
            name="DateOfBirth"
            className={styles.input}
            type="date"
            required=""
          />
        </label>
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
        <label>
          <i className="fa-solid fa-star-of-life"></i>
          <span>Confirm password</span>
          <input
            name="ConfirmPassword"
            className={styles.input}
            type="password"
            required=""
          />
        </label>

        <div className={styles.picture}>
          <label
            htmlFor="file"
            className={styles.custumFileUpload}
            onClick={handleFileIconClick}
          >
            <div className={styles.icon}>
              <svg
                viewBox="0 0 24 24"
                fill=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                    fill=""
                  ></path>
                </g>
              </svg>
            </div>
            <div className={styles.text}>
              <span>{imgeName}</span>
            </div>
            <input
              onChange={toggleImageName}
              // name="AvatarPath"
              id={styles.file}
              type="file"
              ref={fileInputRef}
            />
          </label>
        </div>
        <label>
          <span>About Me</span>
          <textarea
            name="AboutMe"
            className={styles.input}
            type="text"
            placeholder="Says something..."
          ></textarea>
        </label>

        <button type="submit" className={styles.submit}>
          Submit
        </button>
        <p className={styles.signin}>
          Already have an acount ? <Link href="/">Signin</Link>
        </p>
      </form>
    </div>
  );
}
