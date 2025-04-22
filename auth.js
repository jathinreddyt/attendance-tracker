import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import {
  getFirestore, collection, getDocs, addDoc
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

const config={apiKey:"AIzaSyCt3a40qMICx5EaBxxVt6EsMwtYTbpsBcw",
              authDomain:"attendance-849eb.firebaseapp.com",
              projectId:"attendance-849eb",
              storageBucket:"attendance-849eb.firebasestorage.app",
              messagingSenderId:"226907223744",
              appId:"1:226907223744:web:3ac435cf6354ef9c2a1f25"};
const app=initializeApp(config); const auth=getAuth(app); const db=getFirestore(app);

const $=id=>document.getElementById(id); const msg=t=>$("msg").textContent=t;

async function limitReached(){
  const snap=await getDocs(collection(db,"__users")); return snap.size>=5;
}
$("sign-in").onclick=()=>signInWithEmailAndPassword(auth,$("email").value,$("pass").value)
  .then(()=>window.location="index.html").catch(e=>msg(e.message));

$("sign-up").onclick=async()=>{
  if(await limitReached()) return msg("Max 5 users reached.");
  createUserWithEmailAndPassword(auth,$("email").value,$("pass").value)
    .then(async cred=>{
      await addDoc(collection(db,"__users"),{uid:cred.user.uid});
      window.location="index.html";
    })
    .catch(e=>msg(e.message));
};
