import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/Comment.module.css";

import { PostHeader, PostMiddle } from "../home/middle_bloc";
import EmojiForm from "../emoji/emoji";
import { errorNotification } from "../../utils/sweeAlert";
import { EncodeImage } from "../../utils/encodeImage";
import { AddComment, getCommentPost } from "../../handler/comment";
import { useRouter } from "next/router";
import { getSpecificPostsUser } from "../../handler/getPostsUser";
import { getElapsedTime } from "../../utils/convert_dates";
import { ErrorComment } from "../errors/error_profiles";

// export default function Comment() {
//   const router = useRouter();
//   const { postid } = router.query;
//   const [posData, setPostData] = useState(null);
//   const [comment, setComment] = useState(null);

//   if (posData === null && postid !== null) {
//     getSpecificPostsUser(postid, setPostData);
//   }
//   if (comment === null && postid !== null) {
//     getCommentPost(setComment, postid);
//   }

//   return (
//     <div className={`${styles.middleBloc} middle`}>
//       {posData && (
//         <PostHeader
//           iduser={posData.user.id}
//           user={posData.user.firstname}
//           image={posData.user.avatarpath}
//           time={`${getElapsedTime(posData.post.created_at).value} ${getElapsedTime(posData.post.created_at).unit
//             }`}
//         />
//       )}
//       {posData && (
//         <PostMiddle
//           content={posData.post.content}
//           image={posData.post.image_path}
//         />
//       )}
//       {posData && <PostFooterComment like={posData.nbr_likes} comment={posData.nbr_comments} />}
//       {posData && (<FormComment postid={posData.post.id} setComment={setComment} setPostData={setPostData} />)}
//       {posData && comment && <CommentPost data={comment} />}
//     </div>
//   );
// }

export default function Comment() {
  const router = useRouter();
  const { postid } = router.query;
  const [posData, setPostData] = useState(null);
  const [comment, setComment] = useState(null);

  useEffect(() => {
    if (postid) {
      getSpecificPostsUser(postid, setPostData);
      getCommentPost(setComment, postid);
    }
  }, [postid]);

  return (
    <div className={`${styles.middleBloc} middle`}>
      {posData && (
        <>
          <PostHeader
            iduser={posData.user.id}
            user={posData.user.firstname}
            image={posData.user.avatarpath}
            time={`${getElapsedTime(posData.post.created_at).value} ${getElapsedTime(posData.post.created_at).unit}`}
          />
          <PostMiddle
            content={posData.post.content}
            image={posData.post.image_path}
          />
          <PostFooterComment like={posData.nbr_likes} comment={posData.nbr_comments} />
          <FormComment postid={posData.post.id} setComment={setComment} setPostData={setPostData} />
        </>
      )}
      {posData && comment && <CommentPost data={comment} />}
      {!posData && <ErrorComment />}
    </div>
  );
}

export function PostFooterComment({ like, comment }) {
  return (
    <div className="liked">
      <div className="liked-icon">
        <i className="far fa-thumbs-up"></i> <span>{like}</span>
      </div>
      <div className="liked-icon">
        <i className="far fa-comment"></i> <span>{comment}</span>
      </div>
    </div>
  );
}

export function CommentPost({ data }) {
  return (
    (data && <div className={styles.contentAllComments}>
      <div className={styles.containerCommentsMessage}>
        {data && data.map((item, index) => (
          <div key={index} className={styles.contentMessage}>
            <div>
              <div>
                <Link href={`./profileuser?userid=${item && item.user.id}`}>
                  {item.comment.image_path && (
                    <img
                      src={`data:image/png;base64,${item.user.avatarpath}`}
                      alt=""
                    />
                  )}
                  {item.comment.image_path === '' && (
                    <img src={`../images/user-circle.png`} alt="" />
                  )}
                </Link>
                <pre className={styles.message}>{item.comment.content}</pre>
              </div>
              <div className={styles.containerImageComment}>
                {item.comment.image_path && (
                  <img
                    src={`data:image/png;base64,${item.comment.image_path}`}
                    alt=""
                  />
                )}
              </div>
            </div>
            <p>
              <span>by {item.user.firstname}</span>
              {`${getElapsedTime(item.comment.created_at).value} ${getElapsedTime(item.comment.created_at).unit
                } ago`}
            </p>
          </div>
        ))}
      </div>
    </div>)
  );
}

export function FormComment({ postid, setComment, setPostData }) {
  const [emoji, setEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const fileInputRef = useRef(null);
  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  const toggleEmojicon = () => setEmoji(!emoji);

  const handlerFromComment = async (event) => {
    event.preventDefault();

    const hasText = selectedEmoji.trim().length > 0;

    const hasFile = fileInputRef.current?.files[0];

    if (!hasText && !hasFile) {
      errorNotification(
        "Please enter some text or upload an image before submitting."
      );
      return;
    }

    let encodedImage = "";
    if (hasFile) {
      try {
        encodedImage = await EncodeImage(fileInputRef);
      } catch (error) {
        errorNotification(`Failed to encode image: ${error}`);
        return;
      }
    }

    const formData = {
      post_id: postid,
      content: selectedEmoji,
      image_path: encodedImage || undefined,
    };

    AddComment(formData, postid, setComment, setPostData);
  };

  return (
    <form
      method="post"
      onSubmit={handlerFromComment}
      encType="multipart/form-data"
      className={styles.messageBox}
    >
      <div className={styles.plusAndMessage}>
        <div className={styles.fileUploadWrapper}>
          <label htmlFor="file" onClick={handleFileIconClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 337 337"
            >
              <circle
                strokeWidth="20"
                stroke="#6c6c6c"
                fill="none"
                r="158.5"
                cy="168.5"
                cx="168.5"
              ></circle>
              <path
                strokeLinecap="round"
                strokeWidth="25"
                stroke="#6c6c6c"
                d="M167.759 79V259"
              ></path>
              <path
                strokeLinecap="round"
                strokeWidth="25"
                stroke="#6c6c6c"
                d="M79 167.138H259"
              ></path>
            </svg>
            <span className={styles.tooltip}>Add an image</span>
          </label>
          <input type="file" id={styles.file} ref={fileInputRef} />
        </div>
        <span
          onClick={toggleEmojicon}
          className={styles.emoji}
          title="Choose emoji"
        >
          😄
        </span>

        <textarea
          required=""
          placeholder="Write Comment here..."
          type="text"
          value={selectedEmoji}
          name="Content"
          onChange={(e) => setSelectedEmoji(e.target.value)}
          id={styles.messageInput}
        />
      </div>
      <button className={styles.sendButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 664 663"
        >
          <path
            fill="none"
            d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
          ></path>
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="33.67"
            stroke="#6c6c6c"
            d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
          ></path>
        </svg>
      </button>

      {/* emoji form */}
      {emoji && (
        <EmojiForm
          toggleEmojicon={toggleEmojicon}
          setSelectedEmoji={setSelectedEmoji}
        />
      )}
    </form>
  );
}
