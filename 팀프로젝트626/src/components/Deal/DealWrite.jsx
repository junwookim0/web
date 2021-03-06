/* ๐ฅ ๊ฑฐ๋๊ธ ์์ฑ! */
// 06-20 ์ฌ์ฉ์ ์ ๋ณด

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { firestore, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid"; // ์ฌ์ง ๋๋ค ์์ด๋
import { useNavigate } from "react-router-dom";

const DealWrite = () => {

    /* ์ฌ์ฉ์ ์ ๋ณด */
    const { user } = useContext(AuthContext);

    /* ์์ฑํ ์ ๋ชฉ, ์นดํ๊ณ ๋ฆฌ, ๊ฐ๊ฒฉ, ๋ด์ฉ firestore์ ์ ์ฅ */
    const [dCategory, setDCategory] = useState(''); // ์นดํ๊ณ ๋ฆฌ
    const [dTitle, setDTitle] = useState(''); // ์ ๋ชฉ
    const [dHashtag1, setDHashtag1] = useState(''); // ํด์ํ๊ทธ
    const [dHashtag2, setDHashtag2] = useState(''); // ํด์ํ๊ทธ
    const [dHashtag3, setDHashtag3] = useState(''); // ํด์ํ๊ทธ
    const [dPrice, setDPrice] = useState(''); // ๊ฐ๊ฒฉ
    const [dContent, setDContent] = useState(''); // ๋ด์ฉ
    
    /* ์ฌ์ง์ storage */
    const [attachment, setAttachment] = useState('');

    const navigate = useNavigate();

    /* ์ฌ์ฉ ํจ์ */

    const onChange = (e) => {
        const {target: {name, value}} = e;
        
        if(name === 'category') {
            setDCategory(value);
        } else if(name === 'title') {
            setDTitle(value);
        } else if(name === 'hashtag1') {
            setDHashtag1(value);
        } else if(name === 'hashtag2') {
            setDHashtag2(value);
        }else if(name === 'hashtag3') {
            setDHashtag3(value);
        }else if(name === 'price') {
            setDPrice(value);
        } else if(name === 'content') {
            setDContent(value);
        };
    };

    const onFileChange = (e) => {
        const {target: {files}} = e;
        const theFile = files[0];
        // ํ์ผ ์ด๋ฆ ์ฝ๊ธฐ
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile); // ๋ฐ์ดํฐ ์ธ์ฝ๋ฉ
    };

    // ์ด๋ฏธ์ง ์ฒจ๋ถ ์ทจ์
    const onClearAttatchment = () => setAttachment('');

    // submit
    const onSubmit = async (e) => {
        e.preventDefault();
    
        let attachmentUrl = '';
        if (attachment !== '') {
            // ์ฐธ์กฐ ๊ฒฝ๋ก ์์ฑ
            const attachmentRef = ref(storage, `images/${user.uid}/${uuidv4()}`); // ์ฌ์ฉ์ ์์ด๋ ๋ค์ด์ค๋ฉด ์ค๊ฐ์ ๋ฃ์ ๊ฑฐ
            // ์ฐธ์กฐ ๊ฒฝ๋ก๋ก ํ์ผ ์๋ก๋
            // uploadiString ์จ์ผ์ง ๋๋ฐ๋ก ๋ค์ด๊ฐ
            const response = await uploadString(attachmentRef, attachment, "data_url");
            console.log(response);
            attachmentUrl = await getDownloadURL(response.ref);    
        };
    
        // submitํ๋ฉด ์ถ๊ฐํ  ๋ฐ์ดํฐ
        const dealObj = {
            category: dCategory, // ์นดํ๊ณ ๋ฆฌ
            title: dTitle, // ์ ๋ชฉ 
            hashtag1: dHashtag1,
            hashtag2: dHashtag2,
            hashtag3: dHashtag3,
            price: dPrice, // ๊ฐ๊ฒฉ
            content: dContent, // ๋ด์ฉ
            createdAt: Date.now(), // ์์ฑ๋ ์ง
            creatorId: user.uid,
            creatorName: user.displayName, // ์์ฑํ ์ฌ๋ ๋ ํ์
            attachmentUrl: attachmentUrl,
            // 06-21 ์ข์์
            likeCount: 0,
            likeUser: []
        };
    
        await addDoc(collection(firestore, "dbDeals"), dealObj);
    
        // state๋ฅผ ๋น์์ form ๋น์ฐ๊ธฐ
        setDCategory("");
        setDTitle("");
        setDHashtag1("");
        setDHashtag2("");
        setDHashtag3("");
        setDPrice("");
        setDContent("");
    
        // state๋ฅผ ๋น์์ ํ์ผ ๋ฏธ๋ฆฌ๋ณด๊ธฐ img src ๋น์ฐ๊ธฐ
        setAttachment("");
    
        navigate('/deals', {dealObj})
    }; // ํ์ด์ด๋ฒ ์ด์ค ์ ์ฅ ์
    

    return (
        <div>
            <form
            onSubmit={onSubmit}>
                {/* ์นดํ๊ณ ๋ฆฌ ์์ฑ */}
                <label>์นดํ๊ณ ๋ฆฌ</label>
                <select>
                    <option name="category" value="clothes" onChange={onChange}>์๋ฅ</option>
                    <option name="category" value="goods" onChange={onChange}>์กํ</option>
                    <option name="category" value="beuty" onChange={onChange}>๋ทฐํฐ/๋ฏธ์ฉ</option>
                    <option name="category" value="pet" onChange={onChange}>๋ฐ๋ ค๋๋ฌผ</option>
                    <option name="category" value="education" onChange={onChange}>๊ต์ก/์ฒดํ ํคํธ</option>
                    <option name="category" value="etc" onChange={onChange}>๊ธฐํ ์ค๊ณ ๋ฌผํ</option>
                </select> <br />

                {/* ์ ๋ชฉ ์์ฑ */}
                <label>์ ๋ชฉ</label>
                <input
                name="title"
                onChange={onChange}
                value={dTitle}
                type="text" 
                maxLength={80} /> <br />

                {/* ํด์ํ๊ทธ1 ์์ฑ */}
                <label>ํด์ํ๊ทธ</label>
                <input
                name="hashtag1"
                onChange={onChange}
                value={dHashtag1}
                type="text" 
                maxLength={80} /> <br />
                
                {/* ํด์ํ๊ทธ2 ์์ฑ */}
                <label>ํด์ํ๊ทธ</label>
                <input
                name="hashtag2"
                onChange={onChange}
                value={dHashtag2}
                type="text" 
                maxLength={80} /> <br />

                {/* ํด์ํ๊ทธ3 ์์ฑ */}
                <label>ํด์ํ๊ทธ</label>
                <input
                name="hashtag3"
                onChange={onChange}
                value={dHashtag3}
                type="text" 
                maxLength={80} /> <br />

                {/* ๊ฐ๊ฒฉ ์์ฑ */}
                <label>๊ฐ๊ฒฉ</label>
                <input
                name="price"
                onChange={onChange}
                value={dPrice}
                type="number" /> <br />

                {/* ๊ธ ์์ฑ */}
                <textarea
                name="content"
                onChange={onChange}
                value={dContent}
                cols="30" rows="10" /> <br />

                <input 
                onChange={onFileChange}
                type="file" 
                accept="image/*" />

                {/* ๊ฒ์๊ธ ์๋ก๋ */}
                <input 
                type="submit" 
                value="์์ฑ" />

                {/* ์๋ก๋ํ  ์ฌ์ง ๋ฏธ๋ฆฌ ๋ณด๊ธฐ */}
                {attachment && (
                    <div>
                        <img 
                        src={attachment} 
                        width="50px" height="50px" />

                        <button
                        onClick={onClearAttatchment}>์ฒจ๋ถ ํ์ผ ์ญ์ </button>
                    </div>
                )}
            </form>

        </div>
    );
};

export default DealWrite;