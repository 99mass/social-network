import styles from "../../styles/modules/profile-group.module.css";
import { PostFooter, PostHeader, PostMiddle } from "../home/middle_bloc";
export default function Discussion({description}) {
  const data = [
    {
      user: "Lions M ",
      text: "The Lions 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
      imageUrl:
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      date: "16m",
    },
    {
      user: "Lions D ",
      text: "The Lions 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
      imageUrl:
        "https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=",
      date: "16h",
    },
  ];
  return (
    <div className={styles.contentPostAbout}>
      <div className={styles.blocLeft}>
        {data.map((item, index) => (
          <div className="post" key={index}>
            <PostHeader
              user={item.user}
              image={item.imageUrl}
              time={item.date}
            />
            <PostMiddle text={item.text} image={item.imageUrl} />
            <PostFooter />
          </div>
        ))}
      </div>
      <AboutGroup description={description}  />
    </div>
  );
}

export function AboutGroup({description}) {
  
  return (
    <div className={styles.aboutBloc}>
      {description}
     
    </div>
  )
}
