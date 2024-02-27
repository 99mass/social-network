import { useState, useEffect } from "react";
import styles from "../../styles/modules/profile-group.module.css";
import { AboutGroup } from "./discussions";
import { errorNotification } from "../../utils/sweeAlert";
import { convertAge } from "../../utils/convert_dates";
import { AddEvent } from "../../handler/create_event";
import { ListAllEvents } from "../../handler/getAllEvents";

export default function EventLists({ group_id }) {
  const [allevents, setAllEvents] = useState(null);
  const [listUserGoing, setListUserGoing] = useState(false);


  useEffect(() => {
    ListAllEvents(group_id, setAllEvents);
  }, [])

  console.log("allevents", allevents && allevents);


  const toggleListUsers = (state) => setListUserGoing(state);

  return (
    <div className={styles.contentPostAbout}>
      <div className={styles.blocLeft}>
        {allevents && allevents.map((item, index) => (
          <EventBloc
            key={index}
            nameGroup={item.event.title}
            numberPerson={item.going_count}
            time={item.event.day_time}
            content={item.event.description}
            isGoing={item.isGoing}
            toggleListUsers={toggleListUsers}
          />
        ))}
      </div>
      <AboutGroup />
      {listUserGoing && <ListUserAcceptedEvent toggleListUsers={toggleListUsers} setListUserGoing={setListUserGoing} />}
    </div>
  );
}

export function EventBloc({
  nameGroup,
  numberPerson,
  time,
  content,
  isGoing,
  toggleListUsers
}) {

  return (
    <div className={styles.eventDetails}>
      <h2>{nameGroup}</h2>
      <p >
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
      <div>
        {isGoing ? (
          <button>
            <i className="fa-solid fa-circle-check"></i>Going
          </button>
        ) : (
          <button className={styles.btnNotGoing}>
            <i className="fa-solid fa-circle-check"></i>Not going
          </button>
        )}
        <button onClick={() => toggleListUsers(true)} className={styles.btnNotGoing}>
          <i className="fa-solid fa-list-check"></i>Guest List
        </button>
      </div>
    </div>
  );
}
export function FromCreateEvent({ setSection, groupId }) {


  const toggleForm = () =>
    setSection({
      section1: true,
      section2: false,
      section3: false,
      section4: false,
      section5: false,
    });

  const handlerEvent = (e) => {
    e.preventDefault();
    const dataFrom = new FormData(e.target);
    const title = dataFrom.get("title");
    const description = dataFrom.get('description')
    let date = dataFrom.get('date');
    let hours = dataFrom.get('hours')
    if (title.trim() == "" || description.trim() == "" || !date || !hours) {
      errorNotification("all fields must be completed")
      return
    }
    date = new Date(date)
    date = convertAge(date)
    hours = hours.toString()
    const dayTime = `${date} ${hours}`

    const data = {
      group_id: groupId,
      title: title,
      description: description,
      day_time: dayTime
    }
    console.log(data);
    AddEvent(data)

  }

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
      <form method="post" onSubmit={handlerEvent} >
        <div className={styles.eventContent}>
          <input
            type="text"
            name="title"
            className={styles.titleEvent}
            placeholder="Title of the event"
            required
          />
          <hr />
          <textarea
            name="description"
            placeholder="Add description for event..."
            id=""
            required
          ></textarea>
          <hr />
          <div className={styles.contentDateTime}>
            <div>
              <span>Start date</span>
              <input type="date" name="date" />
            </div>
            <div>
              <span>Start time</span>
              <input type="time" name="hours" />
            </div>
          </div>
        </div>
        <button type="submit" className={styles.btnEvent}>Create event</button>
      </form>
    </div>
  );
}

export function ListUserAcceptedEvent({ toggleListUsers }) {
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
          <i onClick={() => toggleListUsers(false)} className={`fa-regular fa-circle-xmark ${styles.closeBtn}`} title="Close lists"></i>
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
                <i className="fa-regular fa-circle-check"></i>
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
                <i className="fa-regular fa-circle-xmark"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
