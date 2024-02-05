import { useRef, useState } from 'react';

import styles from '../../styles/edit-profil.module.css';


export default function EditProfile({ CloseEditForm }) {
    return (
        <div className={styles.editProfileBloc}>
            <h1>
                <span>Edit profile</span>
                <i className="fa-regular fa-circle-xmark" title="Close form" onClick={CloseEditForm}></i>
            </h1>
            <hr />
            <form action="#" method="post">
                <Picture />
                <hr />
                <TypeProfile />
                <hr />
                <BasicInfons />
            </form>
        </div>
    )
}

export function Picture() {

    // lier mon icon plu avec mon input de type file 
    const fileInputRef = useRef(null);
    const handleFileIconClick = () => {
        fileInputRef.current.click();
    };


    return (
        <div className={styles.pictureActual}>
            <h3>actual picture</h3>
            <img src="https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=" alt="" />
            <label htmlFor="file" className={styles.custumFileUpload} onClick={handleFileIconClick}>
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
                    <span>Click to upload image</span>
                </div>
                <input id={styles.file} type="file" ref={fileInputRef} />
            </label>
        </div>
    )
}

export function TypeProfile() {
    const [privacy, setPrivacy] = useState('public');

    const handlePrivacyChange = (newPrivacy) => {
        setPrivacy(newPrivacy);
    };

    return (
        <div className={styles.profileType}>
            <h3>Profile type</h3>
            <div className={styles.contenRadio}>
                <div>
                    <i className="fa-solid fa-earth-americas"></i>
                    <span>Public</span>
                    <input
                        className={`${styles.input} ${styles.inputAltChecked}`}
                        type="radio"
                        name="privacy"
                        checked={privacy === 'public'}
                        onChange={() => handlePrivacyChange('public')}
                    />
                </div>
                <div>
                    <i className="fa-solid fa-lock"></i>
                    <span>Private</span>
                    <input
                        className={`${styles.input} ${styles.inputAltChecked}`}
                        name="privacy"
                        type="radio"
                        checked={privacy === 'private'}
                        onChange={() => handlePrivacyChange('private')}
                    />
                </div>
            </div>
        </div>
    );
}

export function BasicInfons() {
    const [inputFirstName, showInputFirstName] = useState(false)
    const [inputLastName, showInputLastName] = useState(false)
    const [inputNickName, showInputNickName] = useState(false)
    const [inputDateBirthName, showInputDateBirthName] = useState(false)
    const [inputEmailName, showInputEmailName] = useState(false)
    const [inputAboutMeName, showInputAboutMeName] = useState(false)

    const handleInputFirstName = () => {
        if (!inputFirstName) {
            showInputFirstName(true);
        } else {
            showInputFirstName(false);
        }
    }
    const handleInputLastName = () => {
        if (!inputLastName) {
            showInputLastName(true);
        } else {
            showInputLastName(false);
        }
    }
    const handleInputNickName = () => {
        if (!inputNickName) {
            showInputNickName(true);
        } else {
            showInputNickName(false);
        }
    }
    const handleInputDateBirthName = () => {
        if (!inputDateBirthName) {
            showInputDateBirthName(true);
        } else {
            showInputDateBirthName(false);
        }
    }
    const handleInputEmailName = () => {
        if (!inputEmailName) {
            showInputEmailName(true);
        } else {
            showInputEmailName(false);
        }
    }
    const handleInputAboutMeName = () => {
        if (!inputAboutMeName) {
            showInputAboutMeName(true);
        } else {
            showInputAboutMeName(false);
        }
    }


    return (
        <div className={styles.basicInfos}>
            <div className={styles.formControl}>
                <h3>Basic infos</h3>
                {/* First Name */}
                <div className={styles.group}>
                    <p className={styles.formGroup}>
                        <span
                        ><span className={styles.identiti}>First Name : </span><span>Breukh</span>
                        </span >
                        <span className={styles.edit} title="Click to edit First Name" onClick={handleInputFirstName}>edit</span>
                    </p>
                    {inputFirstName && <input className={`${styles.input} ${styles.inputAlt}`} placeholder="First Name here... " type="text" />}                   
                </div>
                {/* Last Name */}
                <div className={styles.group}>
                    <p className={styles.formGroup}>
                        <span
                        ><span className={styles.identiti}>Last Name : </span><span>Doe</span>
                        </span >
                        <span className={styles.edit} title="Click to edit Last Name" onClick={handleInputLastName}>edit</span>
                    </p>
                    {inputLastName && <input className={`${styles.input} ${styles.inputAlt}`} placeholder="Last Name here... " type="text" />  }                 
                </div>
                {/* Nickname */}
                <div className={styles.group}>
                    <p className={styles.formGroup}>
                        <span
                        ><span className={styles.identiti}>Nickname : </span><span>breukhDoe</span>
                        </span>
                        <span className={styles.edit} title="Click to edit Nickname" onClick={handleInputNickName}>edit</span>
                    </p>
                    {inputNickName && <input className={`${styles.input} ${styles.inputAlt}`} placeholder="Nickname here... " type="text" />}                   
                </div>
                {/* Date Of birth */}
                <div className={styles.group}>
                    <p className={styles.formGroup}>
                        <span
                        ><span className={styles.identiti}>Date of Birth : </span><span>15-02-2024</span>
                        </span>
                        <span className={styles.edit} title="Click to edit Date of Birth" onClick={handleInputDateBirthName}>edit</span>
                    </p>
                    {inputDateBirthName && <input className={`${styles.input} ${styles.inputAlt}`} placeholder="Date of Birth ex: dd/mm/yyyy here... " type="text" />}                   
                </div>
                {/* Email */}
                <div className={styles.group}>
                    <p className={styles.formGroup}>
                        <span
                        ><span className={styles.identiti}>Email : </span ><span>breukh@gmail.com</span>
                        </span>
                        <span className={styles.edit} title="Click to edit Email" onClick={handleInputEmailName}>edit</span>
                    </p>
                   {inputEmailName && <input className={`${styles.input} ${styles.inputAlt}`} placeholder="Email here... " type="text" />}                   
                </div>
                {/* About me */}
                <div className={styles.group}>
                    <p className={styles.formGroup}>
                        <span >
                            <span className={styles.identiti}>About Me : </span ><span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Iste quasi tempore ipsa laudantium perspiciatis placeat
                                veritatis sapiente beatae quae minus. Eius dolore tempore
                                dicta soluta officiis eum adipisci rem quas.
                            </span>
                        </span>
                        <span className={styles.edit} title="Click to edit Bio" onClick={handleInputAboutMeName}>edit</span>
                    </p>
                   {inputAboutMeName && <textarea
                        className={`${styles.input} ${styles.inputAlt} ${styles.inputAltTextarea}`}
                        placeholder="About Me here... "
                    ></textarea> }                  
                </div>
            </div>
            <div className={styles.submitUpdate}>
                <button type="submit">update profile</button>
            </div>
        </div>
    )

}