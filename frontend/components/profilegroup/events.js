import styles from "../../styles/modules/profile-group.module.css";
import { AboutGroup } from "./discussions";

export default function Events() {
  const data = [
    {
      nameGroup: "Démarches Visa depuis le Sénégal",
      numberPerson: "5",
      time: "jan-31-2024 11:28",
      content: `
      L'ambiance des stades s'invite à l'Infinity Pool bar du Radisson Blu !
      Supportez votre équipe favorite de la plus grande compétition d'Afrique
      en suivant les rencontres en direct et sur écran géant ! Entrée sur
      consommation ! Infos et réservations: +221 78 187 59 50 #RadissonBlu
      #Itsgametime #MatchDay
      `,
      isGoing: true,
    },
    {
      nameGroup: "ICI C'EST BARÇA",
      numberPerson: "22",
      time: "-31fev-2024 11:28",
      content: `
      L'ambiance des stades s'invite à l'Infinity Pool bar du Radisson Blu !
      Supportez votre équipe favorite de la plus grande compétition d'Afrique
      en suivant les rencontres en direct et sur écran géant ! Entrée sur
      consommation ! Infos et réservations: +221 78 187 59 50 #RadissonBlu
      #Itsgametime #MatchDay
      `,
      isGoing: false,
    },
  ];

  return (
    <div className={styles.contentPostAbout}>
      <div className={styles.blocLeft}>
        {data.map((item, index) => (
          <EventBloc
            key={index}
            nameGroup={item.nameGroup}
            numberPerson={item.numberPerson}
            time={item.time}
            content={item.content}
            isGoing={item.isGoing}
          />
        ))}
      </div>
      <AboutGroup />
    </div>
  );
}

export function EventBloc({ nameGroup, numberPerson, time, content, isGoing }) {
  return (
    <div className={styles.eventDetails}>
      <h2>{nameGroup}</h2>
      <p>
        <i className="fa-solid fa-user-group"></i>
        {numberPerson} person responded Going
      </p>
      <p>
        <i className="fa-solid fa-user-group"></i>
        <span>Event by</span>
        {nameGroup}
      </p>
      <p className={styles.duration}>
        <i className="fa-solid fa-stopwatch"></i>
        {time}
      </p>
      <pre>{content}</pre>
      {isGoing ? (
        <button>
          <i className="fa-solid fa-circle-check"></i>Going
        </button>
      ):(
        <button className={styles.btnNotGoing}><i class="fa-solid fa-circle-check"></i>Not going</button>
      )}
    </div>
  );
}
