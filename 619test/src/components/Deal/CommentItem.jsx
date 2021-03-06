/* π₯ 06-15 λκΈ κ°μ Έμ€κΈ°, μμ , μ­μ  */

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

import styles from './CSS/dealDetail.module.css'

const CommentItem = ({commentObj}) => {
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
        <section>
            <div>
                {
                    editing ? (
                        <>
                            <form onSubmit={onSubmit}>
                                <textarea 
                                onChange={onChange}
                                value={newDComment} cols="80" rows="5"></textarea>
                                <input type="submit" value="λκΈ μμ "/>
                            </form>
                            <button onClick={toggleEditing}>μ·¨μ</button>
                        </>
                    ) : (
                        <>
                            <span>user name</span>
                            <span>date</span>
                            <p>{commentObj.content}</p>
                            <button onClick={onDeleteClick}>μ­μ </button>
                            <button onClick={toggleEditing}>μμ </button>
                        </>
                    )
                }
            </div>
        </section>
    ); 
};

export default CommentItem;