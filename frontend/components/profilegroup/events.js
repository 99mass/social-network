import { useState } from "react";
import styles from "../../styles/modules/profile-group.module.css";
import { AboutGroup } from "./discussions";

export default function Events() {
  const [listUserGoing, setListUserGoing] = useState(false);

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
            setListUserGoing={setListUserGoing}
          />
        ))}
      </div>
      <AboutGroup />
      {listUserGoing && <ListUserAcceptedEvent />}
    </div>
  );
}

export function EventBloc({
  nameGroup,
  numberPerson,
  time,
  content,
  isGoing,
  setListUserGoing,
}) {
  const toggleListUsers = () => setListUserGoing(true);
  return (
    <div className={styles.eventDetails}>
      <h2>{nameGroup}</h2>
      <p onClick={toggleListUsers}>
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
      ) : (
        <button className={styles.btnNotGoing}>
          <i className="fa-solid fa-circle-check"></i>Not going
        </button>
      )}
      
    </div>
  );
}
export function FromCreateEvent({ setSection }) {
  const toggleForm = () =>
    setSection({
      section1: true,
      section2: false,
      section3: false,
      section4: false,
      section5: false,
    });

  return (
    <div className={styles.contentFormEvent}>
      <div className={styles.eventHeader}>
        <h1>create event</h1>
        <i
          onClick={toggleForm}
          className="fa-regular fa-circle-xmark close-form-btn"
          title="Close form"
        ></i>
      </div>
      <hr />
      <form method="post">
        <div className={styles.eventContent}>
          <input
            type="text"
            className={styles.titleEvent}
            placeholder="Title of the event"
            required
          />
          <hr />
          <textarea
            name=""
            placeholder="Add description for event..."
            id=""
            required
          ></textarea>
          <hr />
          <div className={styles.contentDateTime}>
            <div>
              <span>Start date</span>
              <input type="date" />
            </div>
            <div>
              <span>Start time</span>
              <input type="time" />
            </div>
          </div>
        </div>
        <button className={styles.btnEvent}>Create event</button>
      </form>
    </div>
  );
}

export function ListUserAcceptedEvent() {
  const data = [
    {
      image: "../images/default-image.svg",
      user: "userName",
    },
    {
      image: "../images/default-image.svg",
      user: "userName",
    },
    {
      image: "../images/default-image.svg",
      user: "userName",
    },
    {
      image: "../images/default-image.svg",
      user: "userName",
    },
    
  ];
  return (
    <div className={styles.contentListPeopleGoing}>
      <div className={styles.listHeader}>
        <h1>
          <span>Listes Users</span>
          <i className="fa-regular fa-circle-xmark" title="Close lists"></i>
        </h1>
      </div>
      <hr />
      <div className={styles.listFriend}>
        <div className={styles.goingLists}>
          <h2>Going</h2>
          {data.map((item, index) => (
            <div key={index} className={styles.userBloc}>
              <div>
                <img src={item.image} alt="" />
                <span>{item.user}</span> 
                <i class="fa-regular fa-circle-check"></i>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.notGoingLists}>
        <h2>Not Going</h2>
          {data.map((item, index) => (
            <div key={index} className={styles.userBloc}>
              <div>
                <img src={item.image} alt="" />
                <span>{item.user}</span>
                <i class="fa-solid fa-xmark"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
