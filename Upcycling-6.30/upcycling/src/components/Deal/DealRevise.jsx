/* π₯ κ±°λκΈ μμ ! */
// 06-20 μ¬μ©μ μ λ³΄

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { firestore, storage } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid"; // μ¬μ§ λλ€ μμ΄λ
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import styles from './CSS/dealRevise.module.css';

import Nav from "../Nav/Nav";
import SubMainBannerDeal from "../banner/SubMainBannerDeal";

const DealRevise = () => {

    /* μ¬μ©μ μ λ³΄ */
    const { user } = useContext(AuthContext);

    const location = useLocation();
    const deal = location.state.deal;
    console.log(deal)

    /* editing λͺ¨λμΈμ§ μλμ§ */
    const [editing, setEditing] = useState(false);

    /* μλ°μ΄νΈ */
    const [newDTitle, setNewDTitle] = useState(deal.title);
    const [newDHashtag1, setNewHashtag1] = useState(deal.hashtagArray[0]);
    const [newDHashtag2, setNewHashtag2] = useState(deal.hashtagArray[1]);
    const [newDHashtag3, setNewHashtag3] = useState(deal.hashtagArray[2]);
    const [newDPrice, setNewDPrice] = useState(deal.price);
    const [newDContent, setNewDContent] = useState(deal.content);

    /* μ¬μ§μ storage */
    const [newAttachment, setNewAttachment] = useState('');
    const [inputButton, setInputButton] = useState(false)
    const [fileName, setFileName] = useState('');

    const navigate = useNavigate();

    /* editing λͺ¨λ λκ³  μΌκΈ° */
    const toggleEditting = () => {
        setEditing((prev) => !prev)
        navigate(`/deals/${deal.createdAt}`, {state: {deal}})
    };


    const onChange = (e) => {
        const {target: {name, value}} = e;
        
        if(name === 'title') {
            setNewDTitle(value);
        } else if(name === 'hashtag1') {
            setNewHashtag1(value);
        } else if(name === 'hashtag2') {
            setNewHashtag2(value);
        } else if(name === 'hashtag3') {
            setNewHashtag3(value);
        }else if(name === 'price') {
            setNewDPrice(value);
        } else if(name === 'content') {
            setNewDContent(value);
        };
    };

    const onFileChange = (e) => {
        const {target: {files}} = e;
        setInputButton(true);
        const theFile = files[0];
        // νμΌ μ΄λ¦ μ½κΈ°
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setNewAttachment(result);
        };
        reader.readAsDataURL(theFile); // λ°μ΄ν° μΈμ½λ©
        setInputButton(false);
        setFileName(theFile.name);
    };

    const onButtonClick = (e) => {
        e.preventDefault();
        let dealIMG = document.getElementById('dealIMG');
        dealIMG.click();
    };

    /* μλ°μ΄νΈ */
    const onSubmit = async (e) => {
        e.preventDefault();
            
        // μ¬μ§ λ³κ²½νμ§ μμ κ²½μ° νμΌ μ²¨λΆ
        let newAttachmentUrl = deal.attachmentUrl;
        if (newAttachment !== '') {
            const newAttachmentRef = ref(storage, `images/${user.uid}/${uuidv4()}`);
    
            const response = await uploadString(newAttachmentRef, newAttachment, "data_url");
            console.log(response);
            newAttachmentUrl = await getDownloadURL(response.ref)
        };
    
        let date = new Date();
            
        // dbDealsμ μλ°μ΄νΈ
        await updateDoc(doc(firestore, `/dbDeals/${deal.id}`), {
            title: newDTitle,
            hashtagArray: [newDHashtag1, newDHashtag2, newDHashtag3],
            price: newDPrice,
            content: newDContent,
            date : format(date, "yyyy.MM.dd HH:mm"),
            creatorName: user.displayName,
            creatorPhoto: user.photoURL,
            attachmentUrl: newAttachmentUrl
        });
    
        setEditing(false);
    
        // stateλ₯Ό λΉμμ form λΉμ°κΈ°
        setNewDTitle("");
        setNewHashtag1("");
        setNewHashtag2("");
        setNewHashtag3("");
        setNewDPrice("");
        setNewDContent("");
    
        // stateλ₯Ό λΉμμ νμΌ λ―Έλ¦¬λ³΄κΈ° img src λΉμ°κΈ°
        setNewAttachment("");
    
        navigate('/deals', {state: {deal}})
    };
    
    return (
        <>
            <Nav />
            <SubMainBannerDeal />
            <div className={styles.dealWrite}>
                <div className={styles.titleBox}>
                    <h2>λ§μΌ κ²μκΈ μμ νκΈ°</h2>
                </div>
            <form
            onSubmit={onSubmit}
            className={styles.form}>
                {/* μ λͺ© μμ± */}
                <input
                name="title"
                onChange={onChange}
                value={newDTitle}
                type="text" 
                className={styles.input_title}  /> <br />

                {/* κ°κ²© μμ± */}
                <input
                name="price"
                onChange={onChange}
                value={newDPrice}
                type="number"
                placeholder="κ°κ²©μ μλ ₯ν΄ μ£ΌμΈμ"
                className={styles.input_price} /> <br />
                
                {/* νμΌ μλ‘λ - μ λ³΄μ */}            
                <input 
                onChange={onFileChange}
                id="dealIMG"
                type="file" 
                accept="image/*"
                className={styles.fileInput} />

                {/* κΈ μμ± */}
                <textarea
                name="content"
                onChange={onChange}
                value={newDContent}
                className={styles.textarea} /> <br />

                <div className={styles.last_container}>
                        <div className={styles.inner}>
                            <div className={styles.input_container}>
                                {/* μλ‘λν  μ¬μ§ λ―Έλ¦¬ λ³΄κΈ° */}
                                {newAttachment != '' ? (
                                    <div>
                                        <img 
                                        src={newAttachment} 
                                        alt="μλ‘λν μ΄λ―Έμ§"
                                        className={styles.fileInput_img} />
                                    </div>
                                ) : (
                                    <div className={styles.before_uploadedImg}>
                                        <p>μμ ν  μ΄λ―Έμ§λ₯Ό <br />μ²¨λΆν΄ μ£ΌμΈμ</p>
                                    </div>
                                )}

                                <button 
                                className={styles.input_button}
                                onClick={onButtonClick}>
                                    {fileName || <div><i className="fa-solid fa-image"></i> <span>μ΄λ―Έμ§ μ²¨λΆ</span></div>}
                                </button>

                            </div>

                            <div className={styles.hash_container}>
                                <div className={styles.hashtags_box}>
                                    {/* ν΄μνκ·Έ1 μμ± */}
                                    <input
                                    name="hashtag1"
                                    onChange={onChange}
                                    value={newDHashtag1}
                                    type="text" 
                                    placeholder="ν΄μνκ·Έ 1"
                                    className={styles.hashtags} /> <br />
                                    
                                    {/* ν΄μνκ·Έ2 μμ± */}
                                    <input
                                    name="hashtag2"
                                    onChange={onChange}
                                    value={newDHashtag2}
                                    type="text" 
                                    placeholder="ν΄μνκ·Έ 2"
                                    className={styles.hashtags} /> <br />

                                    {/* ν΄μνκ·Έ3 μμ± */}
                                    <input
                                    name="hashtag3"
                                    onChange={onChange}
                                    value={newDHashtag3}
                                    type="text" 
                                    placeholder="ν΄μνκ·Έ 3"
                                    className={styles.hashtags} /> <br />
                                </div>
                            </div>
                            <div className={styles.submit_buttons}>
                                <button 
                                className={styles.button}
                                onClick={toggleEditting}>μ·¨μ</button>
                                {/* κ±°λ μλ‘λ */}
                                <input 
                                type="submit" 
                                value="μμ "
                                className={styles.button} />
                            </div>
                        </div>
                    </div>              
            </form>
        </div>
        </>
    );
};

export default DealRevise;