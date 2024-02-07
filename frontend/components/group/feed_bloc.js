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
      imageUrl:
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      date: "16m",
      like: "100k",
      comment: "2k",
    },
    {
      user: "Lions D ",
      text: "The Lions D 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
      imageUrl:
        "https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=",
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
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      time: "3mn",
    },
    {
      user: "breukh",
      textComment:
        "Lorem ipsum dolor sit amet elit dolor sit amet elit. Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      time: "2mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
      time: "1mn",
    },
  ];

  return (
    <div className={styles.menuMiddle}>
      <div className={styles.contenPosts}>
        {data.map((item, index) => (
          <div key={index} className={styles.contenPost}>
            <PostsFeed item={item} dataComment={dataComment} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PostsFeed({ item, dataComment }) {
  return (
    <>
      <PostHeader user={item.user} image={item.imageUrl} time={item.date} />
      <PostMiddle text={item.text} image={item.imageUrl} />
      <PostFooterComment like={item.like} comment={item.comment} />
      <CommentPost data={dataComment} />
      <FormComment />
    </>
  );
}
