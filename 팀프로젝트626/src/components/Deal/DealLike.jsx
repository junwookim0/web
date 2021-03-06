/* ๐ฅ 06-17 ์ข์์ */
// 06-21 dbDeals์ ์ข์์ ์/ ์ข์์ ๋๋ฅธ ์ ์  ๊ฐ ์๋ฐ์ดํธ

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { firestore } from "../../firebase";
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";

const DealLike = ({dealState}) => {

    /* ์ฌ์ฉ์ ์ ๋ณด */
    const { user } = useContext(AuthContext);
    
    const isMyLike = dealState.likeUser.includes(`${user.uid}`);

    // like ๋ฒํผ์ด ๋๋ ธ๋์ง ์ ๋๋ ธ๋์ง
    const [likeAction, setLikeAction] = useState(isMyLike); // ๊ธฐ๋ณธ์ ์ผ๋ก ์ ๋๋ ค์ ธ ์๋ ์ํ

    /* ์ฌ์ฉ ํจ์ */
    const toggleLike = async () => {
        const dLikeRef = doc(firestore, "dbDeals", dealState.id);

        if(likeAction === false) {
            await updateDoc(dLikeRef, {
                likeCount: increment(1),
                likeUser: arrayUnion(`${user.uid}`)
            });
            setLikeAction(true);
        } else {
            await updateDoc(dLikeRef, {
                likeCount: increment(-1),
                likeUser: arrayRemove(`${user.uid}`)
            });
            setLikeAction(false);
        };
        
    };

    
    return(
            likeAction ? (
                <div>
                    <button 
                    onClick={toggleLike}
                    className="material-icons">
                        favorite
                    </button>
                    <span>
                        {dealState.likeCount}
                    </span>
                </div>
            ) : (
                <div>
                    <button 
                    onClick={toggleLike}
                    className="material-icons">
                        favorite_border
                    </button>
                    <span>
                        {dealState.likeCount}
                    </span>
                </div>
            ) 
    );
};

export default DealLike;