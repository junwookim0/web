import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
/* navbar link*/
import Home from './page/Home';
import About from './components/Intro/IntroList';
import FirstMain from './page/FirstMain/FirstMain';
import EventIntro from './components/Intro/EventIntro';
import SignIn from './components/login/SignIn';
import Mypage from './page/Mypage';
import Abup from './page/Abup';
import SignUp from './components/login/SignUp';
/* firebase api */
import { useContext } from "react";
import AuthContext from "./components/context/AuthContext";
/*๐ ์ง์ import*/
import ReviewWrite from './components/Review/reviewWrite';
import ReviewPage from './components/Review/reviewPage';
import ReviewDetail from './components/Review/reviewDetail';
import ReviewRevise from './components/Review/reviewRevise';

/* ๐ฅ ๋ฐ์ ์ฃผ import ์์ */
import DealWrite from './components/Deal/DealWrite';
import DealPage from './components/Deal/DealPage';
import DealDetail from './components/Deal/DealDetail';
import DealRevise from './components/Deal/DealRevise';
/* ๐ฅ ๋ฐ์ ์ฃผ import ๋ */
import NotFound from './page/NotFound';
import {useState, useEffect} from 'react';
/* app.js > firestore(db) */ 
import { firestore } from './firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
/*footer*/
import Footer from './components/Intro/footer';

function App({reviewRepository, commentRepository, imageUploader, likeRepository}) {
  /*firebase api ์์ user๊ฐ ๋ถ๋ฌ์ค๊ธฐ*/
  const { user } = useContext(AuthContext);
  const userId = user ? user.uid : null
  /*useNavigate๋ก ์ปดํฌ๋ํธ๊ฐ ์ด๋ ์ฃผ์ ์ฌ์ฉ*/
  const navigator = useNavigate();


//๐์ง์ : create & update review 
const createAndUpdateReview = (review,userId) => {
  reviewRepository.saveReview(userId, review);
}

//๐์ง์ : delete review 
const deleteReview = (deletedItem,currentComment) => {

  if(window.confirm("๊ฒ์๊ธ์ ์ ๋ง ์ญ์  ํ์๊ฒ ์ต๋๊น?")){
    reviewRepository.removeReview(userId,deletedItem,currentComment)
    alert('๊ฒ์๊ธ์ ์ญ์ ํ์ต๋๋ค.');
    navigator('/reviews')
  }
  console.log(deletedItem.reviewIMG)
}


//๐์ง์ : delete Comment 
const deleteComment = (comment,reviewId,userId) => {

  if(window.confirm("ํ์ธ์ ๋๋ฅด์๋ฉด ๋๊ธ์ด ์ญ์ ๋ฉ๋๋ค. ")){
    commentRepository.removeComment(userId,reviewId, comment)
    alert('๋๊ธ์ ์ญ์ ํ์ต๋๋ค.');
  }
}

//๐์ง์ : create Comment 
const createAndUpdateComment = (comment,reviewId,userId) => {
  commentRepository.saveComment(userId,reviewId, comment);
}

//๐์ง์ : ์ข์์ ๋๋ฅด๊ธฐ
const clickLike = (userId, review) => {
  likeRepository.saveLike(userId, review)
  console.log('app ์ข์์ ์ฑ๊ณต')
}

//๐์ง์ : ์ข์์ ์ญ์  ๋ก์ง
const removeLike = (userId,review) => {
  likeRepository.removeLike(userId, review)
}

  /* ๐ฅ ํ์ด์ด์คํ ์ด์ ์ ์ฅ๋ผ ์๋ deals ๊ฒ์๊ธ ์ ๋ณด */
  const [deals, setDeals] = useState([]);
  // ๐ฅ ๋ ๋๋ง ์ ์ฝ๋ฐฑ ํจ์ ์คํ
  useEffect(() => {
    // dbDeals ์ฝ๋ ์ ๋ ํผ๋ฐ์ค ๊ฐ์ ธ์ด
    // ์์ฑ ์ผ์ ๋ด๋ฆผ์ฐจ์(์ต๊ทผ ์์)์ผ๋ก ์ ๋ ฌ
    const dq = query(
      collection(firestore, "dbDeals"),
      orderBy("createdAt", "desc")
    );
    // ์์ , ์ญ์  ์ค์๊ฐ ๋ฐ์
    // snapshot -> ๊ฐ๊ฐ์ docs์ ์ ๊ทผํ๊ธฐ ์ํด์ ์ฌ์ฉ
    onSnapshot(dq, (snapshot) => {
      const dealArray = snapshot.docs.map(doc => ({
      // ๊ฐ๊ฐ์ ๊ฐ์ฒด์ ๊ณ ์  id๋ฅผ ๋ง๋ค์ด ํ ๋น
        id: doc.id, ...doc.data()
      }));
      // ๊ฑฐ๋๊ธ ๊ฐ์ฒด ๋ฆฌ์คํธ๋ฅผ setDeals์ ํ ๋น
        setDeals(dealArray);
      })
  }, []);
  

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={!user?<FirstMain/> : <Home reviewRepository={reviewRepository}/>}></Route>
          <Route path="/home" element={user ? <Home reviewRepository={reviewRepository} /> :<SignIn/> }></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path="/aboutupcycling" element={<Abup/>}></Route>
          <Route path="/mypage" element={< Mypage reviewRepository={reviewRepository} deals={deals}/>}></Route>
          <Route path="/signIn" element={<SignIn/>}></Route>
          <Route path="/signUp" element={<SignUp/>}></Route>
          <Route path="/event" element={<EventIntro />}></Route>
          {/* ๐์ค์ง์ router */}
          <Route path='/reviews'  element={<ReviewPage reviewRepository={reviewRepository}/>}/>
          <Route path='/reviews/:id' element={<ReviewDetail reviewRepository={reviewRepository} clickLike={clickLike} removeLike={removeLike} createAndUpdateComment={createAndUpdateComment} deleteReview={deleteReview} deleteComment={deleteComment}/>}/>
          <Route path='/reviews/write' element={<ReviewWrite imageUploader={imageUploader} createAndUpdateReview={createAndUpdateReview}/>}/>
          <Route path='/review/revise/:id' element={<ReviewRevise imageUploader={imageUploader} createAndUpdateReview={createAndUpdateReview} />}/>
          {/* ๐ฅ ๋ฐ์ ์ฃผ route ์์ */}
          <Route path='/deals' element={<DealPage deals={deals} />} />
          <Route path='/deals/:createdAt' element={<DealDetail deals={deals} />} />
          <Route path='/deals/write' element={<DealWrite />} />
          <Route path='/deals/revise/:createdAt' element={<DealRevise />} />
          {/* ๐ฅ ๋ฐ์ ์ฃผ route ๋ */}
          <Route path="/not-found" element={<NotFound />}></Route>
        </Routes>
        <Footer/>
    </div>
  );
}

export default App;
