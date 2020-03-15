import firebase from "firebase/app";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyAlI3gwlYL9bRaryszUnFJWMG6F6RCKzsc",
  authDomain: "photoapp-f0689.firebaseapp.com",
  databaseURL: "https://photoapp-f0689.firebaseio.com",
  projectId: "photoapp-f0689",
  storageBucket: "photoapp-f0689.appspot.com",
  messagingSenderId: "246567172893",
  appId: "1:246567172893:web:1c6de88038d06ec2b03ff4",
  measurementId: "G-ZGWB70X71W"
};

firebase.initializeApp(config);

var storage = firebase.storage();

export { storage, firebase as default };
