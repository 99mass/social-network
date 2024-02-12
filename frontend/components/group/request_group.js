import styles from "../../styles/modules/group.module.css";

export default function RequestGroup() {
  const data = [
    {
      image:
        "https://images.unsplash.com/photo-1611393972804-1b38bddd4e40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9ydW18ZW58MHx8MHx8fDA%3D",
      gName: "group-name",
      nMembres: "721k membres",
    },
    {
      image:
        "https://images.unsplash.com/photo-1652688731647-dd5a21a88465?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8",
      gName: "group-name",
      nMembres: "71k membres",
    },
    {
      image:
        "https://images.unsplash.com/photo-1620924049153-4d32fcbe88fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmV3fGVufDB8fDB8fHww",
      gName: "group-name",
      nMembres: "1k membres",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JvdXB8ZW58MHx8MHx8fDA%3D",
      gName: "group-name",
      nMembres: "7k membres",
    },
  ];

  return (
    <div className={`${styles.menuMiddle} ${styles.discover}`}>
      <div className={styles.contentDicover}>
        <h3>Suggested for you</h3>
        <div className={styles.listPostSugession}>
          {data.map((item, index) => (
            <GoupName
              key={index}
              image={item.image}
              gName={item.gName}
              nMembres={item.nMembres}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GoupName({ image, gName, nMembres }) {
  return (
    <div className={styles.postSugess}>
      <a href="./profilegroup">
        <img src={image} alt="" />
      </a>
      <div>
        <div className={styles.nameGroupMembres}>
          <a href="./profilegroup">
            <span>{gName}</span>
            <span>{nMembres}</span>
          </a>
        </div>
        <button type="submit">join group</button>
      </div>
    </div>
  );
}
