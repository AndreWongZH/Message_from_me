const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");


admin.initializeApp();


exports.emailMessage = functions
    .region("asia-east2")
    .https
    .onRequest((req, res) => {
      const {name, email, message} = req.body;
      const sender = "peter.leejd@gmail.com";
      const pass = "nrfhgfxvfifecmco";

      const transporter = nodemailer.createTransport(`smtps://${sender}:${pass}@smtp.gmail.com`);
      const mailOptions = {
        from: "peter.leejd@gmail.com",
        to: email,
        subject: "Message to myself",
        html: `<h3>Dear ${name}, </h3><p>${message}</p>`,
      };
      transporter.sendMail(mailOptions, function(err, inf) {
        if (err) {
          console.log(err);
          return res.status(400).send({"message": err});
        } else {
          console.log("Email sent: " + inf.response);
          return res.status(200).send({"message": "OK"});
        }
      });
    });

exports.triggerMessage = functions
    .region("asia-east2")
    .https
    .onCall(async (data, context)=> {
      const {name, email, message} = data;
      const sender = "peter.leejd@gmail.com";
      const pass = "nrfhgfxvfifecmco";

      await admin.firestore().collection("messages").add({
        "userId": context.auth.uid || "",
        "message": message,
        "email": email,
        "createdAt": new Date().getTime(),
      });

      const transporter = nodemailer.createTransport(`smtps://${sender}:${pass}@smtp.gmail.com`);
      const mailOptions = {
        from: "peter.leejd@gmail.com",
        to: email,
        subject: "Message from Me",
        html: `
        <p>Dear ${name},</p>
        <p>${message}</p>
        <p><br /><img src="https://cdn.discordapp.com/attachments/868565212431794206/929040504543379456/Asset_11.png" alt="messagefromme logo" width="200" height="40" /></p>
        <p><span style="color: #808080;">
        P.S. This is a message from yourself in the past</span></p>
        <p><a href="http://www.messagefromme.club"><span style="color: #808080;">www.messagefromme.club</span></a></p>
        `,
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return Promise.error(error.message);
        } else {
          console.log("Email sent: "+ info.response);
          return Promise.resolve();
        }
      });
    });


/**
 * @param {string} whoInput user input about who question
 * @param {string} whatInput user input about what question
 * @param {string} whyInput user input about why question
 */
exports.addAboutMe = functions
    .region("asia-east2")
    .https
    .onCall(async (data, context)=> {
      const userId = context.auth.uid;
      const whoInput = data.whoInput;
      const whatInput = data.whatInput;
      const whyInput = data.whyInput;

      // Create a new document or update if not exists
      const aboutMeCol = admin.firestore().collection("aboutme");
      // Check if user entry exists
      const query1 = await aboutMeCol.where("userId", "==", userId).get();

      // User document don't exists
      if (query1.empty) {
        console.log("Creating new document");
        await aboutMeCol.add({
          "userId": userId,
          "whoInput": whoInput,
          "whatInput": whatInput,
          "whyInput": whyInput,
        });
      } else {
        // Update document
        console.log("Update document");
        for (const doc of query1.docs) {
          await doc.ref.update({
            "whoInput": whoInput,
            "whatInput": whatInput,
            "whyInput": whyInput,
          });
        }
      }
      return Promise.resolve();
    });
