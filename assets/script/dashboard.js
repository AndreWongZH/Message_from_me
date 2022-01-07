import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, getDocs, collection, where, query } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 

const auth = getAuth();
const db = getFirestore();

const getMessages = async (uid) => {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, where('userId', '==', uid));
  const messagesQuerySnapshot = await getDocs(q);

  const msglst = document.getElementById('message-list');
  messagesQuerySnapshot.forEach((doc) => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    div.classList.add('message-container');
    p.classList.add('message');
    p.classList.add('color-grey');
    p.innerHTML = doc.data()['message'];
    div.appendChild(p);
    msglst.appendChild(div);
    console.log(doc.data()['message'])
  });

  const div = document.createElement('div');
  div.classList.add('message-container');
  const p = document.createElement('p');
  div.classList.add('message-container');
  p.classList.add('message');
  p.classList.add('color-grey');
  p.classList.add('add-text');
  p.innerHTML = 'Add more messages';
  const a = document.createElement('a');
  a.innerHTML = '+';
  a.href = "./addMessage.html";
  a.classList.add('add-btn');
  div.appendChild(p);
  div.appendChild(a);
  msglst.appendChild(div);
}

const getAboutme = async (uid) => {
  const aboutRef = collection(db, "aboutme");
  const q = query(aboutRef, where('userId', '==', uid));
  const aboutQuerySnapshot = await getDocs(q);
  aboutQuerySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${doc.data()}`);
    console.log(doc.data()['whatInput'])
    console.log(doc.data()['whoInput'])
    console.log(doc.data()['whyInput'])
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log(user.uid)
    const email = document.getElementById('email');
    email.innerHTML = user.email;
    getMessages(user.uid);
    getAboutme(user.uid);
  } else {
    // User is signed out
    // ...
    window.location.href = "./index.html";
  }
});

const logout = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
    window.location.href = './index.html'
  }).catch((error) => {
    // An error happened.
  });
}

document.getElementById('logout').addEventListener('click', logout);
