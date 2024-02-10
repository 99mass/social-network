import Link from "next/link";
import styles from '../../styles/modules/Friend.module.css';

export default function MiddleBlocFriend() {

    const data = [
        {
            image: "https://plus.unsplash.com/premium_photo-1706430116397-3aaba92f5a0a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8",
            username: "username",
            time: "1 week"
        },
        {
            image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D",
            username: "username",
            time: "2 week"
        },
        {
            image: "https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=",
            username: "username",
            time: "3 week"
        },
        {
            image: "https://media.istockphoto.com/id/1369508766/fr/photo/belle-femme-latine-%C3%A0-succ%C3%A8s-souriante.webp?b=1&s=170667a&w=0&k=20&c=hYzjJHP1DkGQIbtSjqwB87c2hplYO1Mn9cgheKr0M7o=",
            username: "username",
            time: "4 week"
        },
        {
            image: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            username: "username",
            time: "5 week"
        },
        {
            image: "https://plus.unsplash.com/premium_photo-1706430116397-3aaba92f5a0a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8",
            username: "username",
            time: "1 week"
        }
    ];

    return (
        <div className={styles.middleBloc}>
            <h1>Friends</h1>
            <h4>Friend requests</h4>
            {
                data.map((item, index) => (
                    <div className={styles.contentFriend} key={index}>
                        <Link href="./profileuser"><img src={"" + item.image} alt="" /></Link>
                        <div className={styles.detailsFriendRequest}>
                            <div className={styles.friendName}><span>{item.username}</span><span>{item.time}</span></div>
                            <div className={styles.validateRequest}>
                                <button>confirm</button><button>delete</button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}
