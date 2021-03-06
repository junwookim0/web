/* π₯ κ±°λκΈ μμ ! */

import React, { useState } from "react";
import { firestore, storage } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid"; // μ¬μ§ λλ€ μμ΄λ
import { useLocation, useNavigate } from "react-router-dom";

const DealRevise = () => {
    const location = useLocation();

    const deal = location.state.deal

    /* editing λͺ¨λμΈμ§ μλμ§ */
    const [editing, setEditing] = useState(false);

    /* μλ°μ΄νΈ */
    const [newDCategory, setNewDCategory] = useState(deal.category);
    const [newDTitle, setNewDTitle] = useState(deal.title);
    const [newDHashtag1, setNewHashtag1] = useState(deal.hashtag1);
    const [newDHashtag2, setNewHashtag2] = useState(deal.hashtag2);
    const [newDHashtag3, setNewHashtag3] = useState(deal.hashtag3);
    const [newDPrice, setNewDPrice] = useState(deal.price);
    const [newDContent, setNewDContent] = useState(deal.content);

    // μ¬μ§ μλ‘λ κ΄λ ¨
    const [newAttachment, setNewAttachment] = useState(deal.attachment);

    const navigate = useNavigate();

    /* editing λͺ¨λ λκ³  μΌκΈ° */
    const toggleEditting = () => {
        setEditing((prev) => !prev)
        navigate(`/deals/${deal.createdAt}`, {state: {deal}})
    };

    /* μλ°μ΄νΈ */ // useEffect
    const onSubmit = async (event) => {
        event.preventDefault();
        
        let newAttachmentUrl = '';
        if(newAttachment !== '') {
            // μ°Έμ‘° κ²½λ‘ μμ±
            const attachmentRef = ref(storage, `images/${uuidv4()}`); // μ¬μ©μ μμ΄λ λ€μ΄μ€λ©΄ μ€κ°μ λ£μ κ±°
            // μ°Έμ‘° κ²½λ‘λ‘ νμΌ μλ‘λ
            // uploadiString μ¨μΌμ§ λλ°λ‘ λ€μ΄κ°
            const response = await uploadString(attachmentRef, newAttachment, "data_url");
            console.log(response)
            newAttachmentUrl = await getDownloadURL(response.ref);    
        };

        // dbDealsμ μλ°μ΄νΈ
        await updateDoc(doc(firestore, `/dbDeals/${deal.id}`), {
            category: newDCategory,
            title: newDTitle,
            hashtag1: newDHashtag1,
            hashtag2: newDHashtag2,
            hashtag3: newDHashtag3,
            price: newDPrice,
            content: newDContent,
            attachmentUrl: newAttachmentUrl
        });
        // stateλ₯Ό λΉμμ form λΉμ°κΈ°
        setNewDCategory("");
        setNewDTitle("");
        setNewHashtag1("");
        setNewHashtag2("");
        setNewHashtag3("");
        setNewDPrice("");
        setNewDContent("");

        // stateλ₯Ό λΉμμ νμΌ λ―Έλ¦¬λ³΄κΈ° img src λΉμ°κΈ°
        setNewAttachment("");

        setEditing(false);

        navigate(`/deals/${deal.createdAt}`, {state: {deal}})
    };

    const onChange = (e) => {
        const {target: {name, value}} = e;
        
        if(name === 'category') {
            setNewDCategory(value);
        } else if(name === 'title') {
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
        // 06-16 ν λ²μ ν κ°μ νμΌ μλ ₯νλλ‘ νλλ° μ¬λ¬ μ₯ κ°λ₯νκ²λ μμ ,,, μ΄μΌ ν¨
        const theFile = files[0];
        // νμΌ μ΄λ¦ μ½κΈ°
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setNewAttachment(result);
        };
        reader.readAsDataURL(theFile); // λ°μ΄ν° μΈμ½λ©
    };

    const onClearAttatchment = () => setNewAttachment('');

    return (
        <section>
            <form
            onSubmit={onSubmit}>
                {/* μΉ΄νκ³ λ¦¬ μμ± */}
                <label>μΉ΄νκ³ λ¦¬</label>
                <select>
                    <option name="category" value={newDCategory}>μλ₯</option>
                    <option name="category" value={newDCategory}>μ‘ν</option>
                    <option name="category" value={newDCategory}>λ·°ν°/λ―Έμ©</option>
                    <option name="category" value={newDCategory}>λ°λ €λλ¬Ό</option>
                    <option name="category" value={newDCategory}>κ΅μ‘/μ²΄ν ν€νΈ</option>
                    <option name="category" value={newDCategory}>κΈ°ν μ€κ³ λ¬Όν</option>
                </select> <br />

                {/* μ λͺ© μμ± */}
                <label>μ λͺ©</label>
                <input
                name="title"
                onChange={onChange}
                value={newDTitle}
                type="text" 
                maxLength={80} /> <br />

                {/* ν΄μνκ·Έ1 μμ± */}
                <label>ν΄μνκ·Έ</label>
                <input
                name="hashtag1"
                onChange={onChange}
                value={newDHashtag1}
                type="text" 
                maxLength={80} /> <br />
                
                {/* ν΄μνκ·Έ2 μμ± */}
                <label>ν΄μνκ·Έ</label>
                <input
                name="hashtag2"
                onChange={onChange}
                value={newDHashtag2}
                type="text" 
                maxLength={80} /> <br />

                {/* ν΄μνκ·Έ3 μμ± */}
                <label>ν΄μνκ·Έ</label>
                <input
                name="hashtag3"
                onChange={onChange}
                value={newDHashtag3}
                type="text" 
                maxLength={80} /> <br />

                {/* κ°κ²© μμ± */}
                <label>κ°κ²©</label>
                <input
                name="price"
                onChange={onChange}
                value={newDPrice}
                type="number" /> <br />

                {/* κΈ μμ± */}
                <textarea
                name="content"
                onChange={onChange}
                value={newDContent}
                cols="30" rows="10" /> <br />

                <input 
                onChange={onFileChange}
                type="file" 
                accept="image/*" />

                {/* κ±°λ μλ‘λ */}
                <input 
                type="submit" 
                value="μμ " />
                            
                {/* μλ‘λν  μ¬μ§ λ―Έλ¦¬ λ³΄κΈ° */}
                {newAttachment && (
                    <div>
                        <img 
                        src={newAttachment} 
                        width="50px" height="50px" />

                        <button
                        onClick={onClearAttatchment}>μ²¨λΆ νμΌ μ­μ </button>
                    </div>
                )}
            </form>

            <button onClick={toggleEditting}>μ·¨μ</button>

        </section>
    );
};

export default DealRevise;