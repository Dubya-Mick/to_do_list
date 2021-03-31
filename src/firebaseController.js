/** @format */

import logicController from './logicController';

const firebaseController = (() => {
  const firebaseInit = () => {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: 'AIzaSyC2wWd7HpkBruVM_15ECvd1QczL-5EdnIQ',
      authDomain: 'just-todo-it-c710c.firebaseapp.com',
      projectId: 'just-todo-it-c710c',
      storageBucket: 'just-todo-it-c710c.appspot.com',
      messagingSenderId: '467014252687',
      appId: '1:467014252687:web:e9feb182d68dbb3713d8fa',
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  };

  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  const signOut = () => {
    firebase.auth().signOut();
  };

  const getUserName = () => firebase.auth().currentUser.displayName;

  const isUserSignedIn = () => !!firebase.auth().currentUser;

  const getCurrentUserUID = () => firebase.auth().currentUser.uid;

  const updateFirestore = () => {
    const userProjectsRef = firebase
      .firestore()
      .collection('users')
      .doc(getCurrentUserUID());
    userProjectsRef.get().then(() => {
      userProjectsRef.set({
        projects: logicController.projects,
      });
    });
  };

  return {
    firebaseInit,
    signIn,
    signOut,
    getUserName,
    isUserSignedIn,
    getCurrentUserUID,
    updateFirestore,
  };
})();

export default firebaseController;
