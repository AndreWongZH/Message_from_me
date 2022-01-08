import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-functions.js";
import { app } from "./firebase.js";

const auth = getAuth();
const functions = getFunctions(app, "asia-east2");
var uid;

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log(user.uid)
    uid = user.uid;
  } else {
    // User is signed out
    window.location.href = "./index.html";
  }
});

const addMessage = () => {
  const message = document.getElementById('message').value;
  const delivers = document.getElementsByName('deliver');
  const name = document.getElementById('name').value;
  const emailsend = document.getElementById('emailsend').value;

  const triggerMessage = httpsCallable(functions, "triggerMessage");
  triggerMessage({
    name: name,
    email: emailsend,
    message: message,
  }).then((result) => {
  });
  window.location.href = "./dashboard.html";
}

document.getElementById('send').addEventListener("click", addMessage);