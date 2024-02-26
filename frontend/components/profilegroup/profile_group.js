import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/modules/profile-group.module.css";
import Discussion from "./discussions";
import  EventLists, { FromCreateEvent } from "./events";
import PostGroup from "./post_group";
import ChatGroup from "./chat_group";
import { getDatasProfilGroup } from "../../handler/group_profile";
import { defaultImage } from "../group/group_page";
import { AddGroupInvitations,  DeclineInvitation } from "../../handler/groupAction";

DeclineInvitation
import { AddGroupInvitations } from "../../handler/groupAction";
import { JoingGroupRequestHandler } from "../../handler/jointGroup";

export default function Profile_group() {
  const [postForm, setPostForm] = useState(false);
  const [datas, setDatasProfileGroup] = useState(null);
  const [postGroup, setPostsGroup] = useState(null);
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (!datas) {
      getDatasProfilGroup(setDatasProfileGroup, query.id);
    }
  }, [query, datas]);

 
  const   handlerSendInvitations = (userId) => {
    AddGroupInvitations(userId, query.id, setDatasProfileGroup)
  };

  const handlerDeclineInvitaionGroup = (userId) => {
    
    DeclineInvitation(query.id, userId,  setDatasProfileGroup);
  };

 
  
  const [section, setSection] = useState({
    section1: true,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
  });

  const handleSection = ({
    section1,
    section2,
    section3,
    section4,
    section5,
  }) => {
    setSection({ section1, section2, section3, section4, section5 });
  };

  const togglePostForm = () => {
    setPostForm(!postForm);
    section.section1 = true;
    section.section2 = false;
  };

  return (
    <>
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
      />
     
      {section.section1 && <Discussion description={ datas && datas.GroupInfos.description} />}
      {section.section2 && <PostGroup PostForm={togglePostForm} />}
      {section.section3 && <EventLists group_id={datas && datas.GroupInfos.id} />}
      {section.section4 && <ChatGroup setSection={setSection} />}
      {section.section5 && <FromCreateEvent setSection={setSection} groupId={datas && datas.GroupInfos.id} />}
    </>
  );
}

export function ContentCovertPhotoGroup({ section, handleSection, image, title, members, friendList, listMembers, groupId, handlerSendInvitations, handlerDeclineInvitaionGroup,  isMember}) {
  const [stateBtnJoinGroup, setStateBtnJoinGroup] = useState(false);
  const [friend, setFriend] = useState(false);
  const [membre, setMembre] = useState(false);

  const handleStateBtnJoinGroup = (state) => {
    setStateBtnJoinGroup(state);
    if (!state) {
      JoingGroupRequestHandler(groupId, setDatasProfileGroup);
    }
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
          {!stateBtnJoinGroup && !isMember && (
            <button
              onClick={() => handleStateBtnJoinGroup(isMember)}
              className={styles.active}
            >
              <i className="fa-solid fa-people-group"></i>Join group
            </button>
          )}
          {stateBtnJoinGroup && isMember && (
            <button onClick={() => handleStateBtnJoinGroup(isMember)}>
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
        <NavMenuGroup section={section} handleSection={handleSection} />
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
      
      {membre && <ListMembreGroup toggleMembres={toggleMembres} listMembers={listMembers} />}
      {friend && <ListFriend toggleFriend={toggleFriend} friendList={friendList}  handlerSendInvitations={handlerSendInvitations} handlerDeclineInvitaionGroup={handlerDeclineInvitaionGroup}/>}
    </div>
  );
}

export function NavMenuGroup({ section, handleSection }) {
  const handleClick = (clickedSection) => {
    const newSection = {
      section1: false,
      section2: false,
      section3: false,
      section4: false,
      section5: false,
      [clickedSection]: true,
    };
    handleSection(newSection);
  };

  return (
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
      </button>
    </div>
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

export function ListFriend({ toggleFriend, friendList, handlerSendInvitations, handlerDeclineInvitaionGroup}) {
 
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
            {item.isInvited && item.isUserSenderInvitation &&(
              <button style={{ background: 'red' }} onClick={() => handlerDeclineInvitaionGroup(item.user.id)}>
                <i className="fa-solid fa-trash"></i>Delete
              </button>
            )}
            {item.isInvited && !item.isUserSenderInvitation  && (
              <button style={{ background: 'grey' }}>
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
