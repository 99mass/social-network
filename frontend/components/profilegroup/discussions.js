import styles from "../../styles/modules/profile-group.module.css";
import { PostFooter, PostHeader, PostMiddle } from "../home/middle_bloc";
export default function Discussion({ description }) {
  const data = [
    {
      user: "Lions M ",
      text: "The Lions 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
      imageUrl: '',
      date: "16m",
    },
    {
      user: "Lions D ",
      text: "The Lions 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
      imageUrl: '',
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
            <PostMiddle content={item.text} image={item.imageUrl} />
            <PostFooter />
          </div>
        ))}
      </div>
      <AboutGroup description={description} />
    </div>
  );
}

export function AboutGroup({ description }) {

  return (
    <div className={styles.aboutBloc}>
      {description}

    </div>
  )
}
