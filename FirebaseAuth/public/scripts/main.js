var rhit = rhit || {};


/* Main */
/** function and class syntax examples */
rhit.main = function () {
    console.log("Ready");

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in
          const displayName = user.displayName;
          const email = user.email;
          const photoURL = user.photoURL;
          const phoneNumber = user.phoneNumber
          const isAnonymous = user.isAnonymous;
          const uid = user.uid;

          console.log("The user is signed in", uid);
          console.log('displayName :>> ', displayName);
          console.log('email :>> ', email);
          console.log('photoURL :>> ', photoURL);
          console.log('phoneNumber :>> ', phoneNumber);
          console.log('isAnonymous :>> ', isAnonymous);
          console.log('uid :>> ', uid);
        } else {
          // User is signed out
          // ...
          console.log("The user is no user signed in");
        }
      });

    const inputEmailEl = document.querySelector("#inputEmail");
    const inputPasswordEl = document.querySelector("#inputPassword");

    document.querySelector("#signOutButton").onClick = (event) => {
        console.log(`Sign out`)
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            console.log("You are now signed out");
          }).catch((error) => {
            // An error happened.
            console.log("Signed out error");
          });
    }
    document.querySelector("#createAccountButton").onClick = (event) => {
        console.log(`Create account for eamil: ${inputEmailEl.value} password: ${inputPasswordEl.value}`)

        firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Create account error", errorCode, errorMessage)
        });
            
    };
    document.querySelector("#logInButton").onClick = (event) => {
        console.log(`Log in for eamil: ${inputEmailEl.value} password: ${inputPasswordEl.value}`)

        firebase.auth().signInrWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Existing account log in error", errorCode, errorMessage)
        });
      
    };

    document.querySelector("#anonymousButton").onClick = (event) => {
        console.log(`Log in for eamil: ${inputEmailEl.value} password: ${inputPasswordEl.value}`)

        firebase.auth().createUserWithEmailAndPassword().catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Anonymous auth error", errorCode, errorMessage)
        });
    };
    rhit.startFirebaseUI();
};

rhit.startFirebaseUI = function() {
    var uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
      };

      // Initialize the FirebaseUI Widget using Firebase.
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
}
rhit.main();