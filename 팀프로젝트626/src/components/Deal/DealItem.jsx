/* ๐ฅ deal ๋ชฉ๋ก์ ๊ฐ์ฒด */
// 06-20 ์ฌ์ฉ์ ์ ๋ณด

import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DealItem = ({deal}) => {
    /* ์ฌ์ฉ์ ์ ๋ณด */
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // dealDetail๋ก ์ด๋
    const onClick = () => {
        navigate(`/deals/${deal.createdAt}`, {state: {deal}})
    };

    return (
        <div>
            <img
            width="150px"
            src={deal.attachmentUrl}
            onClick={onClick} />
            <h3>{deal.title}</h3>
            {/* ์์ฑ์๊ฐ ๊ฐ๊ฒฉ ์๋ ฅํ์ผ๋ฉด ์์ฑ๋ ๊ฐ๊ฒฉ ๋ธ
                ์์ฑ์๊ฐ ๊ฐ๊ฒฉ ์๋ ฅ ์ ํ์ผ๋ฉด ๋๋๐งก ๋ธ */}
            {
                deal.price == '' ? (
                    <p>๋๋๐งก</p>
                ) : (
                    <p>{deal.price}์</p>
                )
            }
            <p>{user.displayName}</p>
        </div>
    );
};

export default DealItem;