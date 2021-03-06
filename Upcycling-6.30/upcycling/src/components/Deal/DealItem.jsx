/* π₯ deal λͺ©λ‘μ κ°μ²΄ */
// 06-20 μ¬μ©μ μ λ³΄
// css μ

import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from './CSS/dealItem.module.css';

const DealItem = ({deal}) => {
    /* μ¬μ©μ μ λ³΄ */
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // price μ² λ¨μλ‘ νν
    let dealPrice = Number(deal.price).toLocaleString('ko-KR');
    
    /* μ¬μ© ν¨μ */
    // dealDetailλ‘ μ΄λ
    const onClick = () => {
        navigate(`/deals/${deal.createdAt}`, {state: {deal}})
    };
    return (
        <section className={styles.container}>
            <img
            src={deal.attachmentUrl}
            onClick={onClick}
            className={styles.dealImg} />
            <h3>{deal.title}</h3>
            {/* μμ±μκ° κ°κ²© μλ ₯νμΌλ©΄ μμ±λ κ°κ²© λΈ
                μμ±μκ° κ°κ²© μλ ₯ μ νμΌλ©΄ λλπ λΈ */}
            {
                deal.price == '' ? (
                    <h3>λλ π</h3>
                ) : (
                    <h3>&#8361; {dealPrice}</h3>
                )
            }
            <p className={styles.name}>{deal.creatorName}</p>
            <div className={styles.likeBox}>
                <div className={styles.icon}>
                    <i className="fa-solid fa-heart"></i>
                </div>
                <p className={styles.amount}>{deal.likeCount}</p>
            </div>
        </section>
    );
};

export default DealItem;