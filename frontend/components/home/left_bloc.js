import Link from "next/link";
import { useState, useEffect } from "react";
import Post from "../form/post";
import Group from "../form/group";
import { getUserBySession } from "../../handler/getUserBySession";

export default function LeftBloc({setPosts}) {

  const [datasUser, setDatasUser] = useState(null);

  const [postForm, setPostForm] = useState(false);
  const [groupForm, setGroupForm] = useState(false);

  useEffect(() => {
    getUserBySession(setDatasUser);
  }, []);

  const togglePostForm = () => setPostForm((prevState) => !prevState);
  const toggleGroupForm = () => setGroupForm((prevState) => !prevState);

  return (
    <>
      <div className="menu-left">
        <div className="user-actual">
          <Link href={`./profileuser?userid=${datasUser && datasUser.id}`}>
            {datasUser && datasUser.avatarpath && (
              <img
                src={`data:image/png;base64,${datasUser && datasUser.avatarpath
                  }`}
                alt=""
              />
            )}
            {datasUser && !datasUser.avatarpath && (
              <img src="../images/default-image.svg" alt="" />
            )}
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
      {postForm && <Post togglePostForm={togglePostForm} setPostForm={setPostForm} setPosts={setPosts} />}
      {groupForm && <Group toggleGroupForm={toggleGroupForm} setGroupForm={setGroupForm} />}
    </>
  );
}
