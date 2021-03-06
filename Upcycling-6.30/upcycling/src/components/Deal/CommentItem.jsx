/* π₯ 06-15 λκΈ κ°μ Έμ€κΈ°, μμ , μ­μ  */
// 06-20 μ¬μ©μ μ λ³΄
// μμ±μ μμ΄λ = νμ¬ μμ΄λ κ°μ λ μ­μ  μμ  λ²νΌ λ³΄μ

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

import styles from "./CSS/commentReviseForm.module.css"

const CommentItem = ({ commentObj }) => {
    /* μ¬μ©μ μ λ³΄ */
    const { user } = useContext(AuthContext);

    // editing λͺ¨λμΈμ§ μλμ§
    const [editing, setEditing] = useState(false);
    // μλ°μ΄νΈ
    const [newDComment, setNewDComment] = useState(commentObj.content);
    
    const location = useLocation();
    const dealState = location.state.deal;

    /* μ¬μ© ν¨μ */
    // editing λͺ¨λ λκ³  μΌκΈ°
    const toggleEditing = () => setEditing((prev) => !prev);

    // μλ°μ΄νΈ
    const onSubmit = async (e) => {
        e.preventDefault();
        updateDoc(doc(firestore, `/dbDeals/${dealState.id}/dComments/${commentObj.id}`), {
            content: newDComment}
            );
            setEditing(false);
    };
    
    const onChange = (e) => {
        const {target: {value}} = e;
        setNewDComment(value);
    }

    // λκΈ μ­μ 
    const onDeleteClick = async () => {
        const ok = window.confirm("μ λ§ μ΄ λκΈμ μ­μ νμκ² μ΅λκΉ?");
            if (ok) {
                //ν΄λΉνλ κ²μκΈ νμ΄μ΄μ€ν μ΄μμ μ­μ 
                await deleteDoc(doc(firestore, `/dbDeals/${dealState.id}/dComments/${commentObj.id}`));
            }
        };

    return (
        <>
            {
                editing ? (
                    <div className={styles.container}>
                        <h3 className={styles.user}>{user.displayName}</h3>
                            <form onSubmit={onSubmit}>
                                <textarea 
                                onChange={onChange}
                                value={newDComment}
                                cols="30" rows="10"
                                className={styles.textarea} />
                                <div>
                                    <input 
                                    type="submit" value="λκΈ μμ "
                                    className={styles.button_ok} />
                                    <button 
                                    onClick={toggleEditing}
                                    className={styles.button}>μ·¨μ</button>
                                </div>
                            </form>
                    </div>
                ) : (
                        <div className={styles.comments_item}>
                            <div className={styles.comment_userInfo}>
                                <img src={commentObj.creatorPhoto}
                                alt="νμ¬ μ¬μ©μμ νλ‘ν μ¬μ§μλλ€"
                                className={styles.comment_userPhoto} />
                                <div className={styles.comment_boxContainer}>
                                    <div className={styles.comment_userInfo_container}>
                                        <span className={styles.comments_name}>{commentObj.creatorName}</span>
                                        {commentObj.creatorId == dealState.creatorId ? <span style={{color: 'gray'}}>μμ±μ</span> : <></>}
                                    </div>
                                </div>
                            </div>
                            <p>{commentObj.content}</p>
                            <span className={styles.comments_date}>{commentObj.date}</span>
                            {
                                commentObj.creatorId == user.uid ? (
                                    <>
                                    <div className={styles.buttonBox}>
                                        <button 
                                        onClick={onDeleteClick}
                                        className={styles.button}>
                                            μ­μ 
                                        </button>
                                        <button 
                                        onClick={toggleEditing}
                                        className={styles.button_ok}>
                                            μμ 
                                        </button>
                                    </div>
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    )
                }
        </>
    ); 
};

export default CommentItem;