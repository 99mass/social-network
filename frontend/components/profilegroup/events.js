import { useState, useEffect } from "react";
import styles from "../../styles/modules/profile-group.module.css";
import { AboutGroup } from "./discussions";
import { errorNotification } from "../../utils/sweeAlert";
import { convertAge } from "../../utils/convert_dates";
import { AddEvent } from "../../handler/create_event";
import {
  ListAllEvents,
  eventPartipants,
  list_response_events,
} from "../../handler/getAllEvents";

export default function EventLists({ group_id, description }) {
  const [allevents, setAllEvents] = useState(null);
  const [openEventId, setOpenEventId] = useState(null);

  useEffect(() => {
    ListAllEvents(group_id, setAllEvents);
  }, []);

  const toggleListUsers = (eventId) => {
    setOpenEventId(openEventId === eventId ? null : eventId);
  };


  return (
    <div className={styles.contentPostAbout}>
      <div className={styles.blocLeft}>
        {allevents &&
          allevents.map((item, index) => (
            <div key={`${item.event.id}${index}`}>
              <EventBloc
                nameGroup={item.event.title}
                numberPerson={item.going_count}
                userBy={item.user.firstname}
                time={item.event.day_time}
                content={item.event.description}
                eventID={item.event.id}
                participation_status={item.participation_status}
                toggleListUsers={toggleListUsers}
                group_id={group_id}
                setAllEvents={setAllEvents}
                isListOpen={openEventId === item.event.id}
              />
            </div>
          ))}
      </div>
      {description && <AboutGroup description={description} />}
    </div>
  );
}

export function EventBloc({
  nameGroup,
  numberPerson,
  userBy,
  time,
  content,
  eventID,
  participation_status,
  toggleListUsers,
  group_id,
  setAllEvents,
  isListOpen,
}) {
  const handlerEventParticipant = (chosen_option) => {
    eventPartipants(eventID, chosen_option, group_id, setAllEvents);
  };

  return (
    <>
      <div className={styles.eventDetails}>
        <h2>{nameGroup}</h2>
        <p>
          <i className="fa-solid fa-user-group"></i>
          {numberPerson} person responded Going
        </p>
        <p>
          <i className="fa-solid fa-user-group"></i>
          <span>Event by</span>
          {userBy}
        </p>
        <p className={styles.duration}>
          <i className="fa-solid fa-stopwatch"></i>
          {time}
        </p>
        <pre id={styles.textEvent}>{content}</pre>
        <div>
          <button
            className={participation_status === "Going" ? styles.activeBtn : ""}
            onClick={() => handlerEventParticipant("1")}
          >
            <i className="fa-solid fa-circle-check"></i>Going
          </button>
          <button
            className={
              participation_status === "Not Going" ? styles.activeBtn : ""
            }
            onClick={() => handlerEventParticipant("0")}
          >
            <i className="fa-solid fa-circle-check"></i>Not going
          </button>
          <button
            onClick={() => toggleListUsers(eventID)}
            className={styles.defaultBtn}
          >
            <i className="fa-solid fa-list-check"></i>Guest List
          </button>
        </div>
      </div>
      {isListOpen && (
        <ListUserAcceptedEvent
          eventID={eventID}
          toggleListUsers={toggleListUsers}
        />
      )}
    </>
  );
}

export function FromCreateEvent({section, setSection, groupId }) {
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
    const description = dataFrom.get("description");
    let date = dataFrom.get("date");
    let hours = dataFrom.get("hours");
    const checkedValues = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value);

    if (title.trim() == "" || description.trim() == "" || !date || !hours) {
      errorNotification("all fields must be completed.");
      return;
    }
    if (checkedValues.length < 2) {
      errorNotification("you must choose both options.");
      return;
    }

    date = new Date(date);
    date = convertAge(date);
    hours = hours.toString();
    const dayTime = `${date} ${hours}`;

    const data = {
      group_id: groupId,
      title: title,
      description: description,
      day_time: dayTime,
    };
    AddEvent(data,setSection);
  };

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
      <form method="post" onSubmit={handlerEvent}>
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
        <div className={`${styles.cntr} ${styles.selectOption}`}>
          <p>Options</p>
          <div>
            <div className={styles.contentCheckBox}>
              <input type="checkbox" id="cbx" className={styles.hiddenXsUp} />
              <span>Going</span>
            </div>
            <div className={styles.contentCheckBox}>
              <input type="checkbox" id="cbx" className={styles.hiddenXsUp} />
              <span>Not Going</span>
            </div>
          </div>
        </div>
        <button type="submit" className={styles.btnEvent}>
          Create event
        </button>
      </form>
    </div>
  );
}

export function ListUserAcceptedEvent({ eventID, toggleListUsers }) {
  const [EventLists, setEventLists] = useState(null);
  useEffect(() => {
    list_response_events(eventID, setEventLists);
  }, []);

  return (
    <div className={styles.contentListPeopleGoing}>
      <div className={styles.listHeader}>
        <h1>
          <span>Listes Users</span>
          <i
            onClick={() => toggleListUsers(false)}
            className={`fa-regular fa-circle-xmark ${styles.closeBtn}`}
            title="Close lists"
          ></i>
        </h1>
      </div>
      <hr />
      <div className={styles.listFriend}>
        <div className={styles.goingLists}>
          <h2>Going</h2>
          {EventLists &&
            EventLists.going &&
            EventLists.going.map((item, index) => (
              <div key={`${item.user_id}${index}`} className={styles.userBloc}>
                <div>
                  <span>
                    <img
                      src={
                        item.avatar_path
                          ? `data:image/png;base64,${item.avatar_path}`
                          : `../images/user-circle.png`
                      }
                      alt=""
                    />
                    <span>{item.user_name}</span>
                  </span>
                  <i className="fa-regular fa-circle-check"></i>
                </div>
              </div>
            ))}
        </div>

        <div className={styles.notGoingLists}>
          <h2>Not Going</h2>
          {EventLists &&
            EventLists.not_going &&
            EventLists.not_going.map((item, index) => (
              <div key={`${item.user_id}${index}`} className={styles.userBloc}>
                <div>
                  <span>
                    <img
                      src={
                        item.avatar_path
                          ? `data:image/png;base64,${item.avatar_path}`
                          : `../images/user-circle.png`
                      }
                      alt=""
                    />
                    <span>{item.user_name}</span>
                  </span>
                  <i className="fa-regular fa-circle-xmark"></i>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
