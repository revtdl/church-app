// Firebase Configuration - Shared across mobile and admin apps
const firebaseConfig = {
    apiKey: "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g",
    authDomain: "churchapp-74dec.firebaseapp.com",
    projectId: "churchapp-74dec",
    storageBucket: "churchapp-74dec.firebasestorage.app",
    messagingSenderId: "684996448330",
    appId: "1:684996448330:web:4531fce57b5af27c4c16b3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
