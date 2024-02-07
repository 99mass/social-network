import styles from '../../styles/modules/group.module.css';

export default function LeftBlocGroupPage() {
    return(
           <div className={styles.menuLeft }>
            <h2>Groups</h2>
            <div className={styles.blocNav}>
                <h4><i className="fa-solid fa-mobile-screen"></i>your feed</h4>
                <h4><i className="fa-regular fa-compass"></i>discover</h4>
                <h4><i className="fa-solid fa-people-group"></i>your groups</h4>
                <h4><i className="fa-solid fa-wand-sparkles"></i>request groups</h4>

            </div>
           <a href="./create-group.html" className={styles.btnNewroup}><i className="fa-solid fa-plus"></i>create new group</a>
            <hr />
            <h4 className={styles.h4ListGroupManaged}>Groups you manage</h4>
            <div className={styles.listGroupManaged}>
                <div className={styles.group}>
                    <a href="./profile-group.html">
                        <img src="./images/barca.png" alt="" />
                        <span>barca</span>
                    </a>
                </div>
                {/* <div className="group">
                    <a href="./profile-group.html">
                        <img src="./images/psg.jpeg" alt="" />
                        <span>pSG</span>
                    </a>
                </div>
                <div className="group">
                    <a href="./profile-group.html">
                        <img src="./images/city.png" alt="" />
                        <span>manchester city</span>
                    </a>
                </div>
                <div className="group">
                    <a href="./profile-group.html">
                        <img src="./images/bayern.png" alt="" />
                        <span>bayern munich</span>
                    </a>
                </div>
                <div className="group">
                    <a href="./profile-group.html">
                        <img src="./images/sentv.jpeg" alt="" />
                        <span>sen tv</span>
                    </a>
                </div>


                <div className="group">
                    <a href="./profile-group.html">
                        <img src="./images/sentv.jpeg" alt="" />
                        <span>sen tv</span>
                    </a>
                </div>
                <div className="group">
                    <a href="./profile-group.html">
                        <img src="./images/sentv.jpeg" alt="" />
                        <span>sen tv</span>
                    </a>
                </div>
                <div className="group">
                    <a href="./profile-group.html">
                        <img src="./images/sentv.jpeg" alt="" />
                        <span>sen tv</span>
                    </a>
                </div>
                 <div className="group">
                    <a href="./profile-group.html">
                        <img src="./images/sentv.jpeg" alt="" />
                        <span>sen tv</span>
                    </a>
                </div> */}
            </div>
        </div>

    )
}