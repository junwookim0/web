/* π₯ κ±°λκΈ μμΈν! */

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, deleteDoc, query, collection, where, onSnapshot } from "firebase/firestore";
import { ref, deleteObject } from "@firebase/storage";
import { firestore, storage } from "../../firebase";

import styles from './CSS/dealDetail.module.css'

import Nav from "../Nav/Nav";
import SubMainBnnerDeal from "../banner/SubMainBannerDeal";
import CommentWrite from "./CommentWrite";
import DealLike from "./DealLike";

const DealDetail = () => {
    /* μ¬μ©μ μ λ³΄ */
    const { user } = useContext(AuthContext);

    const location = useLocation();
    const dealState = location.state.deal;
    const navigate = useNavigate();

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

    // price μ² λ¨μ
    let dealPrice = Number(dealState.price).toLocaleString('ko-KR');

    return (
        <section>
            <Nav />
            <SubMainBnnerDeal />
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.userInfo}>
                        <img src={dealState.creatorPhoto}
                        className={styles.userPhoto} />
                        <div className={styles.userInfo_innerContainer}>
                            <h3 className={styles.userName}>{dealState.creatorName}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
            <img src={dealState.attachmentUrl} alt="λ§μΌ μΉ΄νκ³ λ¦¬ κ²μκΈμ μ¬μ§μλλ€" />
                <div className={styles.content_container}>                    
                    {/* μ λ³΄ */}
                    <div className={styles.title}>
                        <div className={styles.container_title}>
                            <span className={styles.dealTitle}>{dealState.title}</span>
                            <span className={styles.date}>{dealState.date}</span>
                        </div>
                        <div className={styles.tags}>
                            {dealState.hashtagArray[0]&& <span className={styles.hashtags}># {dealState.hashtagArray[0]} </span>}
                            {dealState.hashtagArray[1]&& <span className={styles.hashtags}># {dealState.hashtagArray[1]} </span>}
                            {dealState.hashtagArray[2]&& <span className={styles.hashtags}># {dealState.hashtagArray[2]} </span>}
                        </div>
                        {
                            dealState.price == '' ? (
                                <span className={styles.price}>λλπ</span>
                            ) : (
                                <span className={styles.price}>&#8361; {dealPrice}</span>
                            )
                        }
                    </div>
                    <p className={styles.description}>{dealState.content}</p>
                </div>
                
                <div className={styles.icon_container}>
                <div className={styles.icon_container_left}>
                    {/* μ’μμ */}
                    <DealLike 
                    isMyLike={dealState.likeUser.includes(user.uid)}
                    dealState={dealState} />
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
            </div>


            {/* λκΈ μμ± */}
            <div className={styles.comments_container}>
                <CommentWrite />
            </div>
            
        </section>
    );

};

export default DealDetail;