/* π₯ κ±°λκΈ μμΈν! */
// κ²μκΈ(λκΈ(ν΄μΌ λ¨), νμΌ(νμ)) μ­μ , μμ (revise νμ΄μ§λ‘ μ΄λ)
// commentWrite μ°κ²°
// dealLike μ°κ²°
// λκΈ κ°μ μΈκΈ° ν΄μΌ λ¨
// 06-20 λ‘κ·ΈμΈ λ μ¬λ = μμ±μμΌ κ²½μ°μλ§ μ­μ , μμ  λ²νΌ λ³΄μ΄λλ‘

import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "@firebase/storage";
import { firestore, storage } from "../../firebase";

import styles from './CSS/dealDetail.module.css'

import CommentWrite from "./CommentWrite";
import DealLike from "./DealLike";

import { async } from "@firebase/util";

const DealDetail = () => {
    /* μ¬μ©μ μ λ³΄ */
    const { user } = useContext(AuthContext);

    const location = useLocation();
    const dealState = location.state.deal;
    const navigate = useNavigate();

    /* μ¬μ© ν¨μ */
    // λ¬Έμ κ°μ Έ
    const returnDoc = async() => {
        const docSnap = await getDoc(doc(firestore, `/dbDeals/${dealState.id}`));
        if(docSnap.exists) {
            console.log (docSnap.data())
        } else(
            console.log('err')
        )

    }

    // κΈ μ­μ 
    const deserRef = ref(storage, dealState.attachmentUrl);

    const onDeleteClick = async() => {
        const ok = window.confirm("μ λ§ μ΄ κ²μκΈμ μ­μ νμκ² μ΅λκΉ?");
            if (ok) {
                    await deleteDoc(doc(firestore, `/dbDeals/${dealState.id}`));
                    // μ­μ  λ²νΌ λλ₯΄λ©΄ /κ±°λ(νμ΄λΈκ²μν)λ‘ λμ΄κ°
                    deleteObject(deserRef).then(() => {
                        console.log('νμΌ μ­μ  μ');
                    }).catch((err) => {
                        console.log('νμΌ μ­μ  μ λ¨')
                    })
                    navigate('/deals');
                }
            };
    
    // κΈ μμ 
    const onReviseClick = (deal) => {
        navigate(`/deals/revise/${deal.createdAt}`, {state: {deal}})
    }

    return (
        <section>
            <div className={styles.header}>
                <button onClick={returnDoc}>zz</button>
                <div className={styles.userInfo}>
                    <p>νλ‘ν μ΄λ―Έμ§</p>
                    <h3>{dealState.creatorName}</h3>
                </div>

                <div className={styles.searchInput}>
                    <input type="text" />
                    <button>Search</button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.container}>
                    <select className="" id="">
                        <option value="">μ¨κΈ°κΈ°</option>
                        <option value="">μ κ³ νκΈ°</option>
                        <option value="">μ­μ </option>
                        <option value="">μμ </option>
                    </select>
                    <div className={styles.title}>
                        <h3>{dealState.title}</h3>
                        <p>{dealState.hashtag}</p>
                    </div>
                    <img src={dealState.attachmentUrl} width="100px" height="100px" />
                    <p className={styles.description}>{dealState.content}</p>
                </div>
            </div>

            <hr />
            <div className={styles.icon_container}>
                <div className={styles.icon_container_left}>
                    {/* μ’μμ */}
                    <DealLike 
                    dealState={dealState} />
                    <p className={styles.comment}>πλκΈκ°μ</p>
                </div>
                {
                    dealState.creatorId == user.uid ? (
                        <div className={styles.icon_container_right}>
                            <button onClick={() => onReviseClick(dealState)}>μμ </button>
                            <button onClick={onDeleteClick}>μ­μ </button>
                        </div>    
                    ) : (
                        <>
                        </>
                    )
                }
            </div>
            {/* λκΈ μμ± */}
            <div>
                <CommentWrite />
            </div>
            
        </section>
    );

};

export default DealDetail;