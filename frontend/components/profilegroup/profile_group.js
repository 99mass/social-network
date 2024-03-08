import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/modules/profile-group.module.css";
import Discussion from "./discussions";
import EventLists, { FromCreateEvent } from "./events";
import PostGroup from "./post_group";
import ChatGroup from "./chat_group";
import { getDatasProfilGroup } from "../../handler/group_profile";
import { defaultImage } from "../group/group_page";
import {
  AcceptGroupInvitProfil,
  AddGroupInvitations,
  DeclineInvitation,
  DeclineJoinGroupRequest,
  leaveInGroup,
} from "../../handler/groupAction";
import { JoingGroupRequestHandler } from "../../handler/jointGroup";
import JoinRequestGroup from "./joinGroupRequest";
import { ErrorProfile } from "../errors/error_profiles";
import { globalSocket } from "../websocket/globalSocket";
import { DisplayPopup } from "../header";
import { Loader } from "../../utils/spinner";

export default function Profile_group() {
  const [isLoading, setIsLoading] = useState(true)
  const [postForm, setPostForm] = useState(false);
  const [datas, setDatasProfileGroup] = useState(null);
  const [postGroup, setPostsGroup] = useState(null);
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (!datas) {
      getDatasProfilGroup(setDatasProfileGroup, query.id).then(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
    }
  }, [query, datas]);

  const handlerSendInvitations = (userId) => {
    AddGroupInvitations(userId, query.id, setDatasProfileGroup);
  };

  const handlerDeclineInvitaionGroup = (userId) => {
    DeclineInvitation(query.id, userId, setDatasProfileGroup);
  };

  const [section, setSection] = useState({
    section1: true,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
  });

  const handleSection = ({
    section1,
    section2,
    section3,
    section4,
    section5,
    section6,
  }) => {
    setSection({ section1, section2, section3, section4, section5, section6 });
  };

  const togglePostForm = () => {
    setPostForm(!postForm);
    section.section1 = true;
    section.section2 = false;
  };

  return (
    <>
      {isLoading ? <Loader /> : datas ? (
        <ContentCovertPhotoGroup
          section={section}
          handleSection={handleSection}
          image={datas && datas.GroupInfos.avatarpath}
          title={datas && datas.GroupInfos.title}
          members={datas && datas.GroupInfos.nbr_members}
          friendList={datas && datas.usersNotInGroup}
          listMembers={datas && datas.listMembreGroup}
          groupId={datas && datas.GroupInfos.id}
          handlerSendInvitations={handlerSendInvitations}
          handlerDeclineInvitaionGroup={handlerDeclineInvitaionGroup}
          isMember={datas && datas.isMember}
          setDatasProfileGroup={setDatasProfileGroup}
          isCreator={datas?.isCreator}
          isJoinRequest={datas?.isJoinRequest}
          isInvited={datas?.isInvited}
        />
      ) : (
        <ErrorProfile />
      )}

      {!isLoading && datas && section.section1 && (
        <Discussion
          postGroup={postGroup}
          setPostsGroup={setPostsGroup}
          groupId={datas && datas.GroupInfos.id}
          description={datas && datas.GroupInfos.description}
          isMember={datas?.isMember}
        />
      )}
      {section.section2 && datas && datas.isMember && (
        <PostGroup
          PostForm={togglePostForm}
          section={section}
          setPostsGroup={setPostsGroup}
          groupId={datas && datas.GroupInfos.id}
        />
      )}
      {section.section3 && datas && datas.isMember && (
        <EventLists
          group_id={datas && datas.GroupInfos.id}
          description={datas && datas.GroupInfos.description} />
      )}
      {section.section4 && datas && datas.isMember && (
        <ChatGroup
          setSection={setSection}
          groupName={datas && datas.GroupInfos.title}
          group_id={datas && datas.GroupInfos.id}
        />
      )}
      {section.section5 && datas && datas.isMember && (
        <FromCreateEvent
          section={section}
          setSection={setSection}
          groupId={datas && datas.GroupInfos.id}
        />
      )}

      {section.section6 && datas?.isCreator && (
        <JoinRequestGroup groupId={datas && datas.GroupInfos.id} />
      )}
    </>
  );
}

export function ContentCovertPhotoGroup({
  section,
  handleSection,
  image,
  title,
  members,
  friendList,
  listMembers,
  groupId,
  handlerSendInvitations,
  handlerDeclineInvitaionGroup,
  isMember,
  setDatasProfileGroup,
  isCreator,
  isJoinRequest,
  isInvited,
}) {
  const [stateBtnJoinGroup, setStateBtnJoinGroup] = useState(false);
  const [friend, setFriend] = useState(false);
  const [membre, setMembre] = useState(false);

  const handleStateBtnJoinGroup = (state) => {
    setStateBtnJoinGroup(state);
    if (!state) {
      JoingGroupRequestHandler(groupId, setDatasProfileGroup);
    }
  };

  const handlerLeaveGroup = () => {
    if (isMember && !isCreator) {
      leaveInGroup(groupId, setDatasProfileGroup);
    }
  };

  const handlerDeclineJoin = () => {
    if (!isMember && isJoinRequest) {
      DeclineJoinGroupRequest(
        groupId,
        setDatasProfileGroup,
        getDatasProfilGroup,
        ""
      );
    }
  };

  const handlerAcceptGroupInvitation = () => {
    AcceptGroupInvitProfil(groupId, setDatasProfileGroup);
  };

  const toggleFriend = () => setFriend(!friend);
  const toggleMembres = () => setMembre(!membre);

  return (
    <div className={styles.photoCovert}>
      <img
        src={image ? `data:image/png;base64,${image}` : defaultImage}
        alt=""
      />

      <h1>{title}</h1>
      <div className={styles.blocActionGroupType}>
        <div className={styles.groupType}>
          <span>
            <i className="fas fa-globe-africa"></i>Public group ·
          </span>
          <span className={styles.membre} onClick={toggleMembres}>
            {members} members
          </span>
        </div>
        <div className={styles.action}>
          {!isMember && !isJoinRequest && isInvited && (
            <button
              onClick={() => handlerAcceptGroupInvitation()}
              className={styles.active}
            >
              <i className="fa-solid fa-people-group"></i>Accept invitation
            </button>
          )}

          {!isMember && !isJoinRequest && !isInvited && (
            <button
              onClick={() => handleStateBtnJoinGroup(isMember)}
              className={styles.active}
            >
              <i className="fa-solid fa-people-group"></i>Join group
            </button>
          )}

          {!isMember && isJoinRequest && (
            <button onClick={() => handlerDeclineJoin()}>
              <i className="fa-solid fa-trash"></i>Pending
            </button>
          )}

          {isMember && !isCreator && (
            <button
              style={{ background: "#c43a33" }}
              onClick={() => handlerLeaveGroup()}
            >
              <i className="fa-solid fa-trash"></i>Leave group
            </button>
          )}

          {isMember && (
            <button onClick={toggleFriend}>
              <i className="fa-solid fa-plus"></i>Invite
            </button>
          )}
        </div>
      </div>
      {isMember && (
        <NavMenuGroup
          section={section}
          handleSection={handleSection}
          isCreator={isCreator}
          groupId={groupId}
        />
      )}

      {membre && (
        <ListMembreGroup
          toggleMembres={toggleMembres}
          listMembers={listMembers}
        />
      )}
      {friend && (
        <ListFriend
          toggleFriend={toggleFriend}
          friendList={friendList}
          handlerSendInvitations={handlerSendInvitations}
        />
      )}

      {membre && (
        <ListMembreGroup
          toggleMembres={toggleMembres}
          listMembers={listMembers}
        />
      )}
      {friend && (
        <ListFriend
          toggleFriend={toggleFriend}
          friendList={friendList}
          handlerSendInvitations={handlerSendInvitations}
          handlerDeclineInvitaionGroup={handlerDeclineInvitaionGroup}
        />
      )}
    </div>
  );
}

export function NavMenuGroup({ section, handleSection, isCreator, groupId }) {
  const [socket, setSocket] = useState(null);
  const [nbrNotifJoinGroupRequest, setNbrNotifJoinGroupRequest] = useState(0);
  const [nbrNotifChatGroup, setNbrNotifChatGroup] = useState(0);
  const [nbrNotifGroupEvent, setNbrNotifGroupEvent] = useState(0)
  const [notifMessagesPrivate, setNotifMessagesPrivate] = useState("");
  const [notifMessagesGroup, setNotifMessagesGroup] = useState("");
  const [notifGroupInvitation, setNotifGroupInvitation] = useState("");
  const [notifFollow, setNotifFollow] = useState("");
  const [notifJoinGroupRequest, setNotifJoinGroupRequest] = useState("");
  const [NotifGroupEvent, setNotifGroupEvent] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        globalSocket(setSocket);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log("socket open profile group ");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!data) return;

      switch (data.type) {
        case "nbr_notif_join_group_request":
          if (data?.content?.length === 0) return
          data && data.content && data.content.forEach(element => {
            if (element.group_id === groupId) {
              setNbrNotifJoinGroupRequest(element.count_join_request)
            }
          });
          break;
        case "nbr_notif_group_event":
          if (data?.content?.length === 0) return
          data && data.content && data.content.forEach(element => {
            if (element.group_id === groupId) {
              setNbrNotifGroupEvent(element.count_join_request)
            }
          });
          break;
        case "nbr_notif_chat_group":
          if (data?.content?.length === 0) return
          data && data.content && data.content.forEach(element => {
            if (element.group_id === groupId) {
              setNbrNotifChatGroup(element.count_join_request)
            }
          });
          break
        case "notif_private_message":
          setNotifMessagesPrivate(data);
          break;
        case "notif_follow_request":
          setNotifFollow(data);
          break;
        case "notif_join_group_request":
          setNotifJoinGroupRequest(data);
          break;
        case "notif_chat_group":
          setNotifMessagesGroup(data);
          break;
        case "notif_group_invitation_request":
          setNotifGroupInvitation(data);
          break;
        case "notif_group_event":
          setNotifGroupEvent(data);
          break
      }
    };
  }, [socket]);

  const handleClick = (clickedSection) => {
    const newSection = {
      section1: false,
      section2: false,
      section3: false,
      section4: false,
      section5: false,
      section6: false,
      [clickedSection]: true,
    };
    handleSection(newSection);

    switch (clickedSection) {
      case "section3":
        setNbrNotifGroupEvent(0)
        break
      case 'section4':
        setNbrNotifChatGroup(0);
        break;
      case "section6":
        setNbrNotifJoinGroupRequest(0)
    }
  };

  return (
    <>
      <div className={styles.navBlocLeft}>
        <button
          onClick={() => handleClick("section1")}
          className={section.section1 ? styles.activeBtn : ""}
        >
          <i className="fa-solid fa-signs-post"></i>Discussion
        </button>
        <button
          onClick={() => handleClick("section2")}
          className={section.section2 ? styles.activeBtn : ""}
        >
          <i className="fa-solid fa-plus"></i>Add post
        </button>
        <button
          onClick={() => handleClick("section3")}
          className={section.section3 ? styles.activeBtn : ""}
        >
          <i className="fa-brands fa-elementor"></i>Events
          {nbrNotifGroupEvent > 0 && <img className="imgNew" src="../images/new.png" alt="" />}
        </button>
        <button
          onClick={() => handleClick("section5")}
          className={section.section5 ? styles.activeBtn : ""}
        >
          <i className="fa-solid fa-plus"></i>Add Event
        </button>
        <button
          onClick={() => handleClick("section4")}
          className={section.section4 ? styles.activeBtn : ""}
        >
          <i className="fa-solid fa-comment"></i>chat
          {nbrNotifChatGroup > 0 && <img className="imgNew" src="../images/new.png" alt="" />}
        </button>

        {isCreator && (
          <button
            onClick={() => handleClick("section6")}
            className={section.section6 ? styles.activeBtn : ""}
          >
            <i className="fa-solid fa-right-to-bracket"></i>Join Request
            {nbrNotifJoinGroupRequest > 0 && <img className="imgNew" src="../images/new.png" alt="" />}
          </button>
        )}
      </div>

      <DisplayPopup
        notifMessagesPrivate={notifMessagesPrivate}
        notifFollow={notifFollow}
        notifJoinGroupRequest={notifJoinGroupRequest}
        notifGroupInvitation={notifGroupInvitation}
        notifMessagesGroup={notifMessagesGroup}
        NotifGroupEvent={NotifGroupEvent}
        setNotifMessagesPrivate={setNotifMessagesPrivate}
        setNotifJoinGroupRequest={setNotifJoinGroupRequest}
        setNotifGroupInvitation={setNotifGroupInvitation}
        setNotifFollow={setNotifFollow}
        setNotifMessagesGroup={setNotifMessagesGroup}
        setNotifGroupEvent={setNotifGroupEvent}
      />

    </>
  );
}

export function ListMembreGroup({ toggleMembres, listMembers }) {
  return (
    <div className={styles.contentListPeopleGoing}>
      <div className={styles.listHeader}>
        <h1>
          <span>Lists Membres</span>
          <i
            onClick={toggleMembres}
            className={`fa-regular fa-circle-xmark ${styles.closeBtn}`}
            title="Close lists"
          ></i>
        </h1>
      </div>
      <hr />
      <div className={styles.listMenmbres}>
        {listMembers.map((item, index) => (
          <div key={index} className={styles.userBloc}>
            <div>
              <Link href={`./profileuser?userid=${item.id}`}>
                <img
                  src={
                    item.avatarpath
                      ? `data:image/png;base64,${item.avatarpath}`
                      : defaultImage
                  }
                  alt=""
                />
              </Link>
              <Link href={`./profileuser?userid=${item.id}`}>
                <span>
                  {item.firstname} {item.lastname}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListFriend({
  toggleFriend,
  friendList,
  handlerSendInvitations,
  handlerDeclineInvitaionGroup,
}) {
  return (
    <div className={styles.contentListPeopleGoing}>
      <div className={styles.listHeader}>
        <h1>
          <span>Lists Friends</span>
          <i
            onClick={toggleFriend}
            className={`fa-regular fa-circle-xmark ${styles.closeBtn}`}
            title="Close lists"
          ></i>
        </h1>
      </div>
      <hr />
      <div className={styles.listMenmbres}>
        {friendList.map((item, index) => (
          <div key={index} className={styles.userBloc}>
            <div>
              <Link href={`./profileuser?userid=${item.user.id}`}>
                <img
                  src={
                    item.user.avatarpath
                      ? `data:image/png;base64,${item.user.avatarpath}`
                      : defaultImage
                  }
                  alt=""
                />
              </Link>
              <Link href={`./profileuser?userid=${item.user.id}`}>
                <span>
                  {item.user.firstname} {item.user.lastname}
                </span>
              </Link>
            </div>
            {item.isInvited && item.isUserSenderInvitation && (
              <button
                style={{ background: "red" }}
                onClick={() => handlerDeclineInvitaionGroup(item.user.id)}
              >
                <i className="fa-solid fa-trash"></i>Delete
              </button>
            )}
            {item.isInvited && !item.isUserSenderInvitation && (
              <button style={{ background: "grey" }}>
                <i className="fa-solid fa-hourglass-half"></i>Other invited
              </button>
            )}

            {!item.isInvited && (
              <button onClick={() => handlerSendInvitations(item.user.id)}>
                <i className="fa-solid fa-share"></i>Invite
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
