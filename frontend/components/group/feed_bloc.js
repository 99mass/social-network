import {
  CommentPost,
  FormComment,
  PostFooterComment,
} from "../comment/comment_bloc";
import { PostHeader, PostMiddle } from "../home/middle_bloc";
import styles from "../../styles/modules/group.module.css";

export function FeedBloc() {
  const data = [
    {
      user: "Lions M ",
      text: "The Lions 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
      imageUrl: "",
      date: "16m",
      like: "100k",
      comment: "2k",
    },
    {
      user: "Lions D ",
      text: "The Lions D 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
      imageUrl: "",
      date: "26m",
      like: "90k",
      comment: "12k",
    },
  ];
  const dataComment = [
    {
      user: "alpha",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "3mn",
    },
    {
      user: "breukh",
      textComment:
        "Lorem ipsum dolor sit amet elit dolor sit amet elit. Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "2mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
  ];

  return (
    <div className={`${styles.menuMiddle} _middle`}>
      <div className={`${styles.contenPosts} _contenPosts`}>
        {data.map((item, index) => (
          <div key={index} className={`${styles.contenPost} _contenPost`}>
            <PostsFeed item={item} dataComment={dataComment} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PostsFeed({ item, dataComment }) {
  return (
    <div className="post">
      <PostHeader iduser={null} user={item.user} image={item.imageUrl} time={item.date} />
      <PostMiddle content={item.text} image={item.imageUrl} />
      <PostFooterComment like={item.like} comment={item.comment} />
      <CommentPost data={null} />
      <FormComment postid={null} setComment={null} />
    </div>
  );
}
