import Link from 'next/link';
import styles from '../../styles/profile.module.css';
import Posts_user from './posts';
import EditProfile from './edit_profile';
import { useState } from 'react';
import Friends from './friend';

export default function Profile_user() {
    const [edit,showEdit]=useState(false)

    const handleEditForm=()=>{
        if (!edit) {
         showEdit(true)  
        }
    }
    const CloseEditForm=()=>{
        if (edit) {
            showEdit(false) 
        }
    }

    return (
        <>
            <ContentCovertPhoto handleEditForm={handleEditForm}/>
            <Posts_user/>
           {edit && <EditProfile  CloseEditForm={CloseEditForm} />}
           <Friends/>
        </>
    )
}
export function ContentCovertPhoto({handleEditForm}) {
    return (
        <div className={styles.photoCovert}>
            <img src="https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=" alt="" />
            <div>
                <img src="https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=" alt="" />
                <p>
                    <span>breukh man</span>
                    <Link href="viewfriend">259 friends</Link>
                </p>
            </div>
            <NavMenu handleEditForm={handleEditForm} />
        </div>
    )
}

export function NavMenu({handleEditForm}) {
    return (
        <div className={styles.menu}>
            <Link href=""><i className="fa-solid fa-signs-post"></i>Post</Link>
            <Link href="" onClick={handleEditForm}><i className="fa-solid fa-pen"></i>Edit profile</Link>
            <Link href="./viewfriend"><i className="fa-solid fa-user-group"></i>Friends</Link>
        </div>
    )
}