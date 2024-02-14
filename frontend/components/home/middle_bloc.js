import Link from "next/link";
import { getPostsUser } from "../../handler/getPostsUser";
import { useEffect, useState } from "react";
import { getElapsedTime } from "../../utils/convert_dates";
import { truncateText } from "../../utils/helper";
import { askForFriends } from "../../handler/follower";

export default function MidlleBloc() {

    const [posts, setPosts] = useState(null)

    useEffect(() => {
        getPostsUser(setPosts)
    }, [])

    console.log(posts && posts);


    return (
        <div className="menu-middle">
            {posts && posts.map((item) => (
                <div className="post" key={item.id}>
                    <PostHeader
                        iduser={item.user_id}
                        user={"breukh"}
                        image={item.image_path}
                        time={`${getElapsedTime(item.created_at).value} ${getElapsedTime(item.created_at).unit}`}
                    />
                    <PostMiddle
                        content={item.content}
                        image={item.image_path}
                    />
                    <PostFooter
                        numberLike={"15k"}
                        numberComment={"6k"}
                        postid={item.id}
                    />
                </div>
            ))
            }

        </div>
    );
}

export function PostHeader({ iduser, user, image, time }) {

    const handlerFollower=()=>{
        askForFriends(iduser);
    }

    return (
        <div className="profileuser">
            <div className="left-side">
                <div className="profile-pic">
                    <Link href={`./profileuser?userid=${iduser}`}><img
                        //  src={`data:image/png;base64,${image}`}
                        src="https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY="
                        alt="" /></Link>
                </div>
                <span>
                    <h3>{user} .<span onClick={handlerFollower} className="follow" title="follow">Follow</span></h3>
                    <p>{time} <sup>.</sup> <i className="fas fa-globe-africa"></i></p>
                </span>

            </div>
        </div>
    )
}

export function PostMiddle({ content, image }) {

    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    };


    return (
        <>
            <div className={`post-content-text ${expanded ? 'expanded' : ''}`} onClick={toggleExpand}>
                <pre> {expanded ? content : truncateText(content)}</pre>
            </div>

            <div className="post-content">
                <img
                    //   src={`data:image/png;base64,${image}`} 
                    src="https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY="

                    alt="" />
            </div>
        </>
    );
}

export function PostFooter({ numberLike, numberComment, postid }) {
    return (
        <div className="liked">
            <div className="liked-icon"><i className="far fa-thumbs-up"></i> <span>{numberLike}</span></div>
            <Link href={`./comment?postid=${postid}`}>
                <div className="liked-icon"><i className="far fa-comment"></i> <span>{numberComment}</span></div>
            </Link>
        </div>
    )
}

