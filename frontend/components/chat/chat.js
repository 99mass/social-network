import Link from "next/link";
import styles from "../../styles/modules/Chat.module.css";
import { useEffect, useState } from "react";
import { getUserBySession } from "../../handler/getUserBySession";
import { globalSocket } from "../websocket/privateMessage";

export default function ListUser() {

  const [datasUser, setDatasUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [FriendsList, setFriendsList] = useState(null);
  useEffect(() => {
    getUserBySession(setDatasUser);
    globalSocket(setSocket);
}, []);

if (socket) {

  socket.onopen= ()=>{
    console.log("socket open chat ");
  }
  
  socket.onmessage =(event)=>{
    console.log("onmessage");
    const data = JSON.parse(event.data)
    console.log(data);
    if (data.type === "users_list") {
      setFriendsList(data.content.IsOnline);
    }
  }
}

console.log(FriendsList&&FriendsList,"fr");
  const data = [
    {
      image:
        "https://plus.unsplash.com/premium_photo-1706430116397-3aaba92f5a0a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8",
      username: "username",
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor",
    },
    // {
    //   image:
    //     "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D",
    //   username: "username",
    //   text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor",
    // },
    // {
    //   image:
    //     "https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=",
    //   username: "username",
    //   text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor",
    // },
    // {
    //   image:
    //     "https://media.istockphoto.com/id/1369508766/fr/photo/belle-femme-latine-%C3%A0-succ%C3%A8s-souriante.webp?b=1&s=170667a&w=0&k=20&c=hYzjJHP1DkGQIbtSjqwB87c2hplYO1Mn9cgheKr0M7o=",
    //   username: "username",
    //   text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor",
    // },
    // {
    //   image:
    //     "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
    //   username: "username",
    //   text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor",
    // },
    // {
    //   image:
    //     "https://media.istockphoto.com/id/1447417199/fr/photo/groupe-de-femmes-heureuses-avec-diff%C3%A9rents-tons-de-peau-souriant-et-sembrassant-dans-un.webp?b=1&s=170667a&w=0&k=20&c=UXxIwgj9eTwh7aE3eh9RL1d1cr3e7SAALe60eqaLsZM=",
    //   username: "username",
    //   text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Lorem ipsum dolor",
    // },
  ];

  return (
    <div className={styles.middleBloc}>
      <h1>Messages</h1>
      <UserOnLine FriendsList={FriendsList}/>

      <LastChatWitheAutherUser data={data} />
    </div>
  );
}

export function UserOnLine({FriendsList}) {

 
  // const data = [
  //   {
  //     image:
  //       "https://plus.unsplash.com/premium_photo-1706430116397-3aaba92f5a0a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8",
  //     username: "username",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D",
  //     username: "username",
  //   },
  //   {
  //     image:
  //       "https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=",
  //     username: "username",
  //   },
  //   {
  //     image:
  //       "https://media.istockphoto.com/id/1369508766/fr/photo/belle-femme-latine-%C3%A0-succ%C3%A8s-souriante.webp?b=1&s=170667a&w=0&k=20&c=hYzjJHP1DkGQIbtSjqwB87c2hplYO1Mn9cgheKr0M7o=",
  //     username: "username",
  //   },
  //   {
  //     image:
  //       "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
  //     username: "username",
  //   },
  //   {
  //     image:
  //       "https://media.istockphoto.com/id/1447417199/fr/photo/groupe-de-femmes-heureuses-avec-diff%C3%A9rents-tons-de-peau-souriant-et-sembrassant-dans-un.webp?b=1&s=170667a&w=0&k=20&c=UXxIwgj9eTwh7aE3eh9RL1d1cr3e7SAALe60eqaLsZM=",
  //     username: "username",
  //   },
  // ];
  return (
    <div className={styles.usersOnline}>
      <h5>users online now</h5>
      <div className={styles.listUsers}>
        {FriendsList&& FriendsList.map((item, index) => (
          <div key={index}>
            <Link href="./chatpage">
              <img src={"" + item.avatarpath} alt="" />
              <i className="fas fa-circle"></i>
              <p>{item.username}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LastChatWitheAutherUser({ data }) {
  return (
    <>
      {data.map((item, index) => (
        <div key={index} className={styles.user}>
          <Link href="./chatpage">
            <img src={item.image} alt="" />
            <div>
              <p>{item.username}</p>
              <p>{item.text}</p>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}
