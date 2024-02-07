import Link from "next/link";
import { useState, useEffect } from "react";
import Post from "../form/post";
import Group from "../form/group";

export default function LeftBloc() {
    const [postForm, setPostFrom] = useState(false)
    const [groupForm, setGroupFrom] = useState(false)


    // affichages des formulaires
    const PostForm = () => {
        if (!postForm) {
            setPostFrom(true)
        } else {
            setPostFrom(false)
        }
    };
    const GroupForm = () => {
        if (!groupForm) {
            setGroupFrom(true)
        } else {
            setGroupFrom(false)
        }
    };

    return (
        <>
            <div className="menu-left">
                <div className="user-actual">
                    <Link href="./profileuser">
                        <img src="https://media.istockphoto.com/id/1284284200/fr/photo/il-est-en-mission.webp?b=1&s=170667a&w=0&k=20&c=mZu_lKLMus2gBTFkRH2KQjsSsD70ycU-rRp9eP1MjsM=" alt="" />
                        <span>breukh doe</span>
                    </Link>
                </div>
                <Link href="./friend" className="menu-left-a"> <i className="fas fa-user-friends"></i>Friends</Link>
                <Link href="./group" className="menu-left-a"> <i className="fas fa-users"></i>Groups</Link>
                <hr />
                <h4>create</h4>
                <div className="new-post-content">
                    <Link href="" onClick={PostForm}> <i className="fa-solid fa-pen-to-square"></i> post</Link>
                    <Link href="" onClick={GroupForm}><i className="fas fa-users"></i>Group</Link>

                </div>
            </div>
            {postForm && <Post PostForm={PostForm} />}
            {groupForm && <Group GroupForm={GroupForm} />}
        </>
    );
}