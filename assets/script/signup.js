import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-functions.js";
import { app } from "./firebase.js";

const functions = getFunctions(app, "asia-east2");
const auth = getAuth();

const signUp = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const who = document.getElementById('who').value;
  const what = document.getElementById('what').value;
  const why = document.getElementById('why').value;
  const message = document.getElementById('message').value;
  const delivers = document.getElementsByName('deliver');
  const name = document.getElementById('name').value;
  const emailsend = document.getElementById('emailsend').value;

  await createUserWithEmailAndPassword(auth, email, password)
    .then( async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('calling add about me');
      const addAboutMe = httpsCallable(functions, 'addAboutMe');
      await addAboutMe({
        whoInput: who,
        whatInput: what,
        whyInput: why,
      }).then((result) => {
      })
      console.log("calling trigger message");
      const triggerMessage = httpsCallable(functions, "triggerMessage");
      await triggerMessage({
        name: name,
        email: email,
        message: message,
      }).then((result) => {
        const data = result.data;
        const sanitizedMessage = data.text;
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  
  // redirect after adding data successfully
    window.location.href = "./dashboard.html";
};

const emailMessageUrl =
  "https://asia-east2-messagefromme-fd60d.cloudfunctions.net/emailMessage";

/**
 * Require 3 inputs
 * @param {string} name
 * @param {string} email
 * @param {string} message
 */
const emailMessageTrigger = (name, email, message) => {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", emailMessageUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      name: name,
      email: email,
      message: message,
    })
  );
  var response = xhr.response;
  console.log(`Response: ${response.message}`);
};

document.getElementById("send").addEventListener("click", signUp);

document.getElementById('signup1-btn').addEventListener('click', () => {
  document.getElementById('signup1').style.display = 'none';
  document.getElementById('signup2').style.display = 'block';
})

document.getElementById('signup2-btn').addEventListener('click', () => {
  document.getElementById('signup2').style.display = 'none';
  document.getElementById('signup3').style.display = 'block';
})