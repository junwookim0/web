import React, { useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CSS/reviewWrite.module.css'

import { useContext } from "react";
import AuthContext from "../context/AuthContext";


//ð Reviewë¥¼ ìì±íë íì´ì§

const ReviewWrite = ({createAndUpdateReview , imageUploader}) => {
    const formRef = useRef();
    const reviewTitleRef = useRef();
    const reviewDescriptionRef = useRef();
    const reviewIMGRef = useRef();

    const reviewHashtagsRef1 = useRef();
    const reviewHashtagsRef2 = useRef();
    const reviewHashtagsRef3 = useRef();
    
    const { user } = useContext(AuthContext);
    const userId = user.uid
    const userName = user.displayName;
    const userEmail = user.email;
    const userPhoto = user.photoURL

    const navigate = useNavigate();

    const [uploadedIMG, setUploadedIMG] = useState()
    const [inputButton, setInputButton] = useState(false)

    const onSubmit = event => {
        event.preventDefault();

        const review = {
            id  : 'R' + Date.now(),
            nickname : userName,
            email : userEmail,
            profileIMG : userPhoto,
            reviewIMG : uploadedIMG,
            reviewTitle : reviewTitleRef.current.value,
            reviewDescription : reviewDescriptionRef.current.value,
            reviewHashtags : [reviewHashtagsRef1.current.value,reviewHashtagsRef2.current.value,reviewHashtagsRef3.current.value,]
        }; 
        formRef.current.reset();
        createAndUpdateReview(review, userId)
        navigate('/reviews');
    }

    const onChange = async (event) => {
        event.preventDefault();
        // console.log(event.target.files[0]);
        setInputButton(true)
        const uploaded = await imageUploader.upload(event.target.files[0]);
            setUploadedIMG(uploaded.url)
        setInputButton(false)
        console.log('ì´ë¯¸ì§ë¡ë©')
    }

    //â­ê¸ì°ê¸° í­ëª©ì´ ë¤ ìì ëë§ ë²í¼ì´ íì±í ë  ììëë¡
    const canSave = Boolean(reviewTitleRef)  && Boolean(reviewDescriptionRef) && Boolean(uploadedIMG)
    return (
            <form className={styles.form} ref={formRef}>
                
                
                    <label htmlFor="reviewTitle">Title : </label>
                    <input ref={reviewTitleRef} id='reviewTitle' name='reviewTitle' type="text" placeholder='ì ëª©' />
                    <br/>
                    <label htmlFor="reviewHashtags">Hashtag : </label>
                        <input ref={reviewHashtagsRef1} name='reviewHashtags' type="text" placeholder='í´ìíê·¸' />
                        <input ref={reviewHashtagsRef2} name='reviewHashtags' type="text" placeholder='í´ìíê·¸' />
                        <input ref={reviewHashtagsRef3} name='reviewHashtags' type="text" placeholder='í´ìíê·¸' />

                    <br/>
                    <textarea 
                        ref={reviewDescriptionRef} 
                        name="" 
                        id="" 
                        cols="30" 
                        rows="10"
                        className={styles.reviewDescription}
                        >

                    </textarea>
                    <br/>
                    { uploadedIMG && (<img src={uploadedIMG} alt='ì´ë¯¸ì§' style={{width: '50px', height: '50px'}} />)}
                    <input 
                        ref={reviewIMGRef}
                        type="file"
                        accept='image/*'
                        name='reviewIMG'
                        onChange={onChange}
                    />
                    <br/>
                    { inputButton &&
                        (<div className={styles.modal_container}>
                            <div className={styles.dialog__inner}>
                                <button className={styles.buttonClose}>â³</button>
                                <div className={styles.dialog__content}>
                                <h3>ì´ë¯¸ì§ë¥¼ ìë¡ë© ì¤ ìëë¤.</h3>
                                <p>ì ìë§ ê¸°ë¤ë ¤ì£¼ì¸ì.</p>
                                <p>ìëì¼ë¡ ë«íëë¤</p>
                                </div>  
                            </div>
                        </div>)
                    }

                    <button 
                    onClick={onSubmit}
                    disabled={!canSave}
                    >ìì±ìë£
                    </button>
            </form>
        
    );
};

export default ReviewWrite;