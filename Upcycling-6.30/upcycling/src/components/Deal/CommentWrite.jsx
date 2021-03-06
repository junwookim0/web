/* ๐ฅ ๋๊ธ ์์ฑ */
// 06-20 ์ฌ์ฉ์ ์ ๋ณด
import styles from './CSS/commentWrite.module.css'

import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { doc, setDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase";
import { format } from "date-fns";
import CommentItem from './CommentItem';

const CommentWrite = () => {
    /* ์ฌ์ฉ์ ์ ๋ณด */
    const { user } = useContext(AuthContext);

    /* ์ ์  ์ ๋ณด, ์์ฑ ๋ ์ง, ์์ฑํ ๋๊ธ firestroe์ ์ ์ฅ */
    const [dComment, setDComment] = useState('');
    /* fitestore์ ์ ์ฅํ ๋๊ธ ๊ฐ์ ธ์ค๊ธฐ */
    const [dComments, setDComments] = useState([]);

    const location = useLocation();
    const dealState = location.state.deal;

    useEffect(() => {

        const subColRef = collection(firestore, "dbDeals", `${dealState.id}`, "dComments");

        onSnapshot(subColRef, (querySnapshot) => {
            const commentArray = querySnapshot.docs.map(doc => ({
                id: doc.id, ...doc.data()
            }));
            setDComments(commentArray);
        });    
    }, []);
    let date = new Date();

    /* ์ฌ์ฉ ํจ์ */
    // ๋๊ธ ์์ฑ
    const onSubmit = async(e) => {
        e.preventDefault();

        //submitํ๋ฉด ์ถ๊ฐํ  ๋ฐ์ดํฐ
        const commentObj = {
            dealTitle: dealState.title,
            content: dComment, // ๋๊ธ
            creatorId: user.uid,
            creatorName: user.displayName,
            creatorPhoto: user.photoURL,
            createdAt: Date.now(),
            date : format(date, "yyyy.MM.dd HH:mm"),
            dealAddress: dealState.createdAt,
            attachmentUrl: dealState.attachmentUrl
        };

        // Date.now()๋ฅผ ๊ธฐ์ค์ผ๋ก ๋๊ธ ๋ฌธ์ ์์ฑ
        await setDoc(doc(collection(firestore, "dbDeals"), `/${dealState.id}`, `dComments/${Date.now()}`), commentObj)

        setDComment("");
    };

    const onChange = (e) => {
        setDComment(e.target.value);
    };

    return (
        <>
            <div className={styles.container}>
                <h3 className={styles.user}>{user.displayName}</h3>
                <form onSubmit={onSubmit}
                className={styles.comment_form}>
                    <textarea 
                    onChange={onChange}
                    value={dComment} 
                    placeholder='๋๊ธ์ ๋จ๊ฒจ ์ฃผ์ธ์'
                    className={styles.textarea}></textarea>
                    <input 
                    type="submit" value="๋๊ธ ์์ฑ"
                    className={styles.button} />
                </form>
            </div>
            <div className={styles.comments_container}>
                <h2 style={{marginLeft: '0.8rem'}}>๋๊ธ</h2>
                { 
                    dComments.map((dComment) => (
                        <CommentItem 
                        key={dComment.createdAt}
                        commentObj={dComment} />
                    ))
                }
            </div>
        </>
    );

};

export default CommentWrite;