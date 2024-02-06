import Link from "next/link";
import styles from '../../styles/modules/Friend.module.css'

export  default function RightBloc() {
    return(
        <div className="menu-rigth">
            <LastFrienRequest/>
            <hr className="menu-rigth-hr" />
            <FriendOnLine/>
        </div>
    );
}

export  function LastFrienRequest() {
    return (
        <>
            <div className="title">
                <h4>Friend requests</h4>
                <span><Link href="./friend" title="see all friend request">see all</Link></span>
            </div>
            <div className={styles.contentFriend}>
                <Link href="./profileuser"><img src="https://media.istockphoto.com/id/1284284200/fr/photo/il-est-en-mission.webp?b=1&s=170667a&w=0&k=20&c=mZu_lKLMus2gBTFkRH2KQjsSsD70ycU-rRp9eP1MjsM=" alt="" /></Link>
                <div className={styles.detailsFriendRequest}>
                    <div className={styles.friendName}><span>ssambadi</span><span>19s</span></div>
                    <div className={styles.validateRequest}>
                        <button>confirm</button><button>delete</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export function FriendOnLine() {
    const data=[
        {
            name:"alice doe",
            image:"https://plus.unsplash.com/premium_photo-1706430116397-3aaba92f5a0a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8"
        },
        {
            name:"michel doe",
            image:"https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            name:"jack doe",
            image:"https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA="
        },
        {
            name:"christin doe",
            image:"https://media.istockphoto.com/id/1369508766/fr/photo/belle-femme-latine-%C3%A0-succ%C3%A8s-souriante.webp?b=1&s=170667a&w=0&k=20&c=hYzjJHP1DkGQIbtSjqwB87c2hplYO1Mn9cgheKr0M7o="
        }
    ]
    return (
        <div className="friend-online">
            <h4>Chat with Friend online</h4>
            <div className="list-users">
                {
                    data.map((item,index)=>(
                        <div key={index}>
                            <Link href="./chatpage">
                                <img src={""+item.image} alt="" /><i className="fas fa-circle"></i>
                                <p>{item.name}</p>
                            </Link>
                        </div>
                    ))
                }                      
            </div>
        </div>
    );
}