
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/modules/Comment.module.css';

import { PostHeader, PostMiddle } from '../home/middle_bloc';
import EmojiForm from '../emoji/emoji';
import { errorNotification } from '../../utils/sweeAlert';
import { EncodeImage } from '../../utils/encodeImage';
import { AddComment, getCommentPost } from '../../handler/comment';
import { useRouter } from 'next/router';


export default function Comment() {
    const router = useRouter();
    const { postid } = router.query;

    const [comment, setComment] = useState(null)
    useEffect(() => {
        if (comment === null) {
            getCommentPost(setComment, postid);
        }
    }, []);

    console.log('comment...');
    console.log(comment && comment);

    const data =
    {
        user: "Lions M ",
        text: "The Lions 💯 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus minima, quod nulla incidunt illum itaque esse fugit! Aspernatur earum, eaque adipisci facilis mollitia eos exercitationem ex porro, consequatur quibusdam perspiciatis.",
        // imageUrl: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
        imageUrl: "",
        date: "16m",
        like: "100k",
        comment: "2k",

    }
    const dataComment = [
        {
            user: "alpha",
            textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
            commentUserUrl: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            time: "3mn"
        },
        {
            user: "breukh",
            textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit. Lorem ipsum dolor sit amet elit dolor sit amet elit.",
            commentUserUrl: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            time: "2mn"
        },
        {
            user: "tom",
            textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
            commentUserUrl: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            time: "1mn"
        },
        {
            user: "tom",
            textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
            commentUserUrl: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            time: "1mn"
        },
        {
            user: "tom",
            textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
            commentUserUrl: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            time: "1mn"
        },
        {
            user: "tom",
            textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
            commentUserUrl: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            time: "1mn"
        },
        {
            user: "tom",
            textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
            commentUserUrl: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=",
            time: "1mn"
        },
    ]

    return (
        <div className={`${styles.middleBloc} middle`}>
            <PostHeader user={data.user} image={data.imageUrl} time={data.date} />
            <PostMiddle text={data.text} image={data.imageUrl} />
            <PostFooterComment like={data.like} comment={data.comment} />
            <CommentPost data={dataComment} />
            <FormComment />
        </div>
    )
}

export function PostFooterComment({ like, comment }) {
    return (
        <div className="liked">
            <div className="liked-icon"><i className="far fa-thumbs-up"></i> <span>{like}</span></div>
            <div className="liked-icon"><i className="far fa-comment"></i> <span>{comment}</span></div>
        </div>
    )
}



export function CommentPost({ data }) {

    return (
        <div className={styles.contentAllComments}>
            <div className={styles.containerCommentsMessage}>
                {data.map((item, index) => (
                    <div key={index} className={styles.contentMessage}>
                        <div>
                            <div>
                                <Link href={`./profileuser?userid=`}><img src={item.commentUserUrl} alt="" /></Link>
                                <pre className={styles.message}>{item.textComment}</pre>
                            </div>
                            <div className={styles.containerImageComment}><img src={`https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY=`} alt="" /></div>
                        </div>
                        <p><span>by {item.user}</span>{item.time}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}



export function FormComment() {

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
            errorNotification('Please enter some text or upload an image before submitting.');
            return;
        }

        let encodedImage = '';
        if (hasFile) {
            try {
                encodedImage = await EncodeImage(fileInputRef);
            } catch (error) {
                errorNotification(`Failed to encode image: ${error}`);
                return;
            }
        }

        const formData = {
            user_id: 1,
            post_id: 2,
            content: selectedEmoji,
            image_path: encodedImage || undefined,
        };

        const jsonString = JSON.stringify(formData);

        AddComment(jsonString)
        //     console.log(jsonString);
    };



    return (
        <form method="post"
            onSubmit={handlerFromComment}
            encType="multipart/form-data"
            className={styles.messageBox}
        >
            <div className={styles.plusAndMessage}>
                <div className={styles.fileUploadWrapper}>
                    <label htmlFor="file" onClick={handleFileIconClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
                            <circle strokeWidth="20" stroke="#6c6c6c" fill="none" r="158.5" cy="168.5"
                                cx="168.5"></circle>
                            <path strokeLinecap="round" strokeWidth="25" stroke="#6c6c6c"
                                d="M167.759 79V259"></path>
                            <path strokeLinecap="round" strokeWidth="25" stroke="#6c6c6c"
                                d="M79 167.138H259"></path>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                    <path fill="none"
                        d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888">
                    </path>
                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="33.67"
                        stroke="#6c6c6c"
                        d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888">
                    </path>
                </svg>
            </button>

            {/* emoji form */}
            {emoji && <EmojiForm toggleEmojicon={toggleEmojicon} setSelectedEmoji={setSelectedEmoji} />}

        </form>
    )
}