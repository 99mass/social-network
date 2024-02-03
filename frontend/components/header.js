import Link from "next/link";
import styles from "../styles/Header.module.css";

export default function Header() {
    return (
        <nav className={styles.top}>
            <div className={styles.fixed}>
                <div className={styles.mainHeader}>
                    <div className={styles.topContent}>
                        <h3 >social-network</h3>
                        <MidlleNAvForBigScreen />
                        <ToggleButton />
                    </div>
                    <MidlleNAvFormSmallScreen />

                </div>
            </div>
        </nav>
    );
}

export function MidlleNAvForBigScreen() {
    return (
        <div className={`${styles.middleContent} ${styles.middleContent0}`}>
            <Link href="/"><i className="active fas fa-home" title="Home"><span>25+</span></i></Link>
            <Link href="/friend"><i className="fas fa-user-friends" title="Friend Requests"><span>4+</span></i></Link>
            <Link href="/chat"><i className="fas fa-comment" title="Chat"><span> 42</span></i></Link>
            <Link href="/notification"><i className="fas fa-bell" title="Notification"><span>22+</span></i></Link>
            <Link href="/group" title="Groups"> <i className="fas fa-users"></i></Link>
        </div>
    );

}
export function MidlleNAvFormSmallScreen() {
    return (
        <div className={`${styles.middleContent} ${styles.middleContent1}`}>
            <Link href="/"><i className="active fas fa-home"><span>25+</span></i></Link>
            <Link href="/friend"><i className="fas fa-user-friends"><span>4+</span></i></Link>
            <Link href="/chat"><i className="fas fa-comment"><span>42</span></i></Link>
            <Link href="/notification"><i className="fas fa-bell"><span>22+</span></i></Link>
            <Link href="/group"> <i className="fas fa-users"></i></Link>
        </div>
    );
}

export function ToggleButton() {
    return (
        <div className={styles.topContentIcons}>
            <i className="fas fa-bars"></i>
        </div>
    );
}