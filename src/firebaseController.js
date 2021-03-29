import DOMcontroller from './DOMcontroller';
import logicController from './logicController';

const firebaseController = (() => {

    const firebaseInit = () => {
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        var firebaseConfig = {
            apiKey: "AIzaSyC2wWd7HpkBruVM_15ECvd1QczL-5EdnIQ",
            authDomain: "just-todo-it-c710c.firebaseapp.com",
            projectId: "just-todo-it-c710c",
            storageBucket: "just-todo-it-c710c.appspot.com",
            messagingSenderId: "467014252687",
            appId: "1:467014252687:web:e9feb182d68dbb3713d8fa"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    const signIn = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    }

    const signOut = () => {
        firebase.auth().signOut();
    }

    const initFirebaseAuth = () => {
        firebase.auth().onAuthStateChanged(DOMcontroller.authStateObserver);
    }

    const getProfilePicUrl = () => {
        return firebase.auth().currentUser.photoURL;
    }

    const getUserName = () => {
        return firebase.auth().currentUser.displayName;
    }

    const isUserSignedIn = () => {
        return !!firebase.auth().currentUser;
    }

    const getCurrentUserUID = () => {
        return firebase.auth().currentUser.uid;
    }

    const getProjectsFromFirestore = (user) => {
        let userProjectsRef = firebase.firestore().collection('users').doc(user.uid);
        userProjectsRef.get().then((doc) => {
            if (doc.exists) {
                console.log(('document data:', doc.data()));
                doc.data().projects.forEach((project) => {
                    logicController.projects.push(project);
                })
                console.log(logicController.projects);
                logicController.setCurrentProject(0);
                DOMcontroller.renderDOM();
            } else {
                DOMcontroller.setTutorialProject();
                userProjectsRef.set({
                    projects: logicController.projects
                })
                DOMcontroller.renderDOM();
            }
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const updateFirestore = () => {
        let userProjectsRef = firebase.firestore().collection('users').doc(getCurrentUserUID());
        userProjectsRef.get().then(() => {
            userProjectsRef.set({
                projects: logicController.projects
            })
        })
        
    }

    return {
        firebaseInit,
        signIn,
        signOut,
        initFirebaseAuth,
        getProfilePicUrl,
        getUserName,
        isUserSignedIn,
        getCurrentUserUID,
        getProjectsFromFirestore,
        updateFirestore
    }

})();

export default firebaseController;