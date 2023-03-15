import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: move config values to .env

const firebaseConfig = {
    apiKey: "AIzaSyC2g8OCYq2cYqzDsxsnRv0uq-NyMl14hbU",
    authDomain: "node-js-tutorial-microservice.firebaseapp.com",
    projectId: "node-js-tutorial-microservice",
    storageBucket: "node-js-tutorial-microservice.appspot.com",
    messagingSenderId: "1039714272143",
    appId: "1:1039714272143:web:bce12f39411a1491b241fa"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const createUser = async ({ email, password }) => createUserWithEmailAndPassword(auth, email, password);