import React, { useRef, useState } from 'react';
import './App.css';
import 'tachyons';
import AOS from 'aos';
import "aos/dist/aos.css";


import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyC1eobM17m5ChgVQ1LfBSKyZfnF8NK00Yg",
  authDomain: "anonychat-d404b.firebaseapp.com",
  databaseURL: "https://anonychat-d404b.firebaseio.com",
  projectId: "anonychat-d404b",
  storageBucket: "anonychat-d404b.appspot.com",
  messagingSenderId: "498096353713",
  appId: "1:498096353713:web:23563c2128ca8fc9480d90"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestone =firebase.firestore();



AOS.init();

function App() {
  const [user] = useAuthState(auth);


  return (
    <div className="App">
      <header className="App-header">
        <section>
          {user ? <ChatRoom/> : <SignIn/>}
        </section>

      </header>
    </div>
  );
}

function SignIn() {
  
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }

  return(
    <section>
          <header className="header-text">
            <h1>Anonychat</h1>

          </header>
          <button className="f6 grow no-underline br-pill ph4 pv3 mb2 mt4 dib white bg-hot-pink" onClick={signInWithGoogle}>Sign in with Google</button>
          <p class="instruction">Please maintain the decorum of the chatroom</p>

    </section>

  );

}


function SignOut() {
  return auth.currentUser && (
    <button className="sign-out-btn f6 link dim br3 ph3 pv3 mb2 dib white bg-dark-green" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy =useRef();

  const messagesRef = firestone.collection("messages");

  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query,{idField: 'id'});

  const [formValue, setFormValue ] = useState(' ');

  const sendMessage = async(e) => {

    e.preventDefault();
    
    const {uid , photoURL} =auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue(' ');

    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }


  return(
    <section className="main-body">
      <nav>
        <h4 className="brand-name">Anonychat</h4>
      </nav>
      <header className="heading">
        <SignOut/>
      </header>
      <div className="message-text">
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        <div ref ={dummy}></div>


      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit" className="f6 link dim br3 ph4 pv2 mr2 dib white bg-light-purple"><span role="img" aria-label="rocket-send">🚀</span></button>
      </form>

    </section>
  );


}

function ChatMessage(props) {
  const {text,uid ,photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  const msgAnimation = uid === auth.currentUser.uid ? 'fade-left' : 'fade-right';

 


  
  return(
    <div>
          <div className={`message-${messageClass}`} data-aos={msgAnimation}>
            <div class="ava pa4 tc">
              <img src={photoURL} class="h3 w3 dib" alt=""/>
            </div>
            <p class="message-text1">{text}</p>
          </div>
    </div>

  );
}

export default App;
