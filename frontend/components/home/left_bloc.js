import Link from "next/link";
import { useState, useEffect } from "react";
import Post from "../form/post";
import Group from "../form/group";
import { getDatasProfilUser } from "../../handler/user_profile";

export default function LeftBloc() {
    
  const [datasUser, setDatasUser] = useState(null);
  const [postForm, setPostForm] = useState(false);
  const [groupForm, setGroupForm] = useState(false);

  const togglePostForm = () => {
    setPostForm(!postForm);
  };

  const toggleGroupForm = () => {
    setGroupForm(!groupForm);
  };

  // recuperer les information du user
  useEffect(() => {
    getDatasProfilUser(setDatasUser);
  }, []);


  return (
    <>
      <div className="menu-left">
        <div className="user-actual">
          <Link href={`./profileuser?userid=${datasUser && datasUser.id}`}>
            <img src={`data:image/png;base64,${datasUser && datasUser.avatarpath}`} alt="" />
            {datasUser && (
              <span>{`${datasUser.firstname} ${datasUser.lastname}`}</span>
            )}
          </Link>
        </div>
        <Link href="./friend" className="menu-left-a">
          <i className="fas fa-user-friends"></i>Friends
        </Link>
        <Link href="./group" className="menu-left-a">
          <i className="fas fa-users"></i>Groups
        </Link>
        <hr />
        <h4>create</h4>
        <div className="new-post-content">
          <Link href="" onClick={togglePostForm}>
            <i className="fa-solid fa-pen-to-square"></i> post
          </Link>
          <Link href="" onClick={toggleGroupForm}>
            <i className="fas fa-users"></i>Group
          </Link>
        </div>
      </div>
      {postForm && <Post PostForm={togglePostForm} />}
      {groupForm && <Group GroupForm={toggleGroupForm} />}
    </>
  );
}
