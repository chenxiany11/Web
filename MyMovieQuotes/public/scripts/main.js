/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Sybil Chen
 */

/** namespace. */
var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTES = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FB_KEY_LAST_AUTHOR = "author";
rhit.fbMovieQuotesManager = null;
rhit.fbSingleQuotesManager = null;
rhit.fbAuthManager = null;

// const ref = firebase.firestore().collection("MovieQuotes");
// ref.onSnapshot((querySnapshot) => {

//     querySnapshot.forEach((doc) => {
// 		console.log(doc.data());
//     });
// });

// ref.add({
// 	quote: "My first test",
// 	movie: "My first movie",
// 	lastTouched: firebase.firestore.Timestamp.now(),
// });

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

rhit.FbSingleQuoteManager = class {
    constructor(movieQuoteId) {
        this._documentSnapshot = {};
        this._unsubscribe = null;
        this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTES).doc(movieQuoteId);
        //   console.log(`listening to ${this._ref.path}`);
    }
    beginListening(changeListener) {
        this._unsubscribe = this._ref.onSnapshot((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                this._documentSnapshot = doc;
                changeListener();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                // window.location.href='/';
            }
        });
    }
    stopListening() {
        this._unsubscribe();
    }

    update(quote, movie) {
        this._ref.update({
                [rhit.FB_KEY_QUOTE]: quote,
                [rhit.FB_KEY_MOVIE]: movie,
                [rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
            })
            .then(() => {
                console.log("Document updated");
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }
    delete() {
        return this._ref.delete();
    }

    get quote() {
        return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
    }

    get movie() {
        return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
    }

    get author() {
        return this._documentSnapshot.get(rhit.FB_KEY_LAST_AUTHOR);
    }
}
}

rhit.ListPageController = class {
    constructor() {
        // document.querySelector("#submitAddQuote").onclick = () =>{
        // }
        document.querySelector("#menuShowAllQuotes").addEventListener("click", (event) => {
          window.location.href = "/list.html"
        });
        document.querySelector("#menuShowMyQuotes").addEventListener("click", (event) => {
            window.location.href = `/list.html?uid=${rhit.fbAuthManager.uid}`;
        });
        document.querySelector("#menuSignOut").addEventListener("click", (event) => {
          rhit.fbAuthManager.signOut();
        });
        document.querySelector("#submitAddQuote").addEventListener("click", (event) => {
            const quote = document.querySelector("#inputQuote").value;
            const movie = document.querySelector("#inputMovie").value;
            rhit.fbMovieQuotesManager.add(quote, movie);
            // $('#addQuoteDialog').modal('hide')

        });
        $("#addQuoteDialog").on('show.bs.modal', (event) => {
            // Pre animation
            document.querySelector("#inputQuote").value = "";
            document.querySelector("#inputMovie").value = "";
        });
        $("#addQuoteDialog").on('shown.bs.modal', (event) => {
            document.querySelector("#inputQuote").focus();
        });


        rhit.fbMovieQuotesManager.beginListening(this.updateList.bind(this));

    }
    updateList() {
        const newList = htmlToElement('<div id="quoteListContainer"><div>');
        for (let i = 0; i < rhit.fbMovieQuotesManager.length; i++) {
            const mq = rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(i);
            console.log(mq.movie);
            console.log(mq.quote);
            const newCard = this._createCard(mq);
            newCard.onclick = (event) => {
                // console.log(`You clicked on ${mq.id}`);
                // rhit.storage.setMovieQuoteId(mq.id);
                window.location.href = `/moviequote.html?id=${mq.id}`;
            };
            newList.appendChild(newCard);
        }
        const oldList = document.querySelector("#quoteListContainer");
        oldList.removeAttribute("id");
        oldList.hidden = true;
        oldList.parentElement.appendChild(newList);
    }
    _createCard(movieQuote) {
        return htmlToElement(`<div class="card">
		<div class="card-body">
		  <h5 class="card-title">${movieQuote.quote}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${movieQuote.movie}</h6>
		</div>
	  </div>`);
    }
}

rhit.FbMovieQuotesManager = class {
    constructor(uid) {
        this.uid = uid;
        this._documentSnapshots = [];
        this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTES);
        this._unsubscribe = null;
    }
    add(quote, movie) {
        console.log("addmovie" + `${movie}`);
        console.log("addquote" + `${quote}`);
        // Add a new document with a generated id.
        this._ref.add({
                [rhit.FB_KEY_QUOTE]: quote,
                [rhit.FB_KEY_MOVIE]: movie,
                [rhit.FB_KEY_LAST_AUTHOR]: rhit.fbAuthManager.uid,
                [rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
            })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }
    beginListening(changeListener) {
        let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);
        if (this._uid) {
            query = query.where(rhit.FB_KEY_LAST_AUTHOR, "==", this._uid);
        }
        this._unsubscribe = query.onSnapshot((querySnapshot) => {
            console.log("Movie Quote update");
            this._documentSnapshots = querySnapshot.docs;
            // querySnapshot.forEach((doc) =>{
            // 	console.log(doc.data());
            // });
            changeListener();
        });
    }
    stopListening() {
        this._unsubscribe();
    }
    // update(id, quote, movie) {    }
    // delete(id) { }
    get length() {
        return this._documentSnapshots.length;
    }
    getMovieQuoteAtIndex(index) {
        const docSnapshot = this._documentSnapshots[index];
        const mq = new rhit.MovieQuote(
            docSnapshot.id,
            docSnapshot.get(rhit.FB_KEY_QUOTE),
            docSnapshot.get(rhit.FB_KEY_MOVIE));
        return mq;
    }

}
rhit.MovieQuote = class {
    constructor(id, quote, movie) {
        this.id = id;
        this.quote = quote;
        this.movie = movie;
    }

}

rhit.DetailPageController = class {
    constructor() {
        document.querySelector("#menuSignOut").addEventListener("click", (event) => {
            rhit.fbAuthManager.signOut();
          });
        document.querySelector("#submitEditQuote").addEventListener("click", (event) => {
            const quote = document.querySelector("#inputQuote").value;
            const movie = document.querySelector("#inputMovie").value;
            rhit.fbSingleQuotesManager.update(quote, movie);
            // $('#addQuoteDialog').modal('hide')

        });
        $("#editQuoteDialog").on('show.bs.modal', (event) => {
            // Pre animation
            document.querySelector("#inputQuote").value = rhit.fbSingleQuotesManager.quote;
            document.querySelector("#inputMovie").value = rhit.fbSingleQuotesManager.movie;
        });
        //post animation
        $("#editQuoteDialog").on('shown.bs.modal', (event) => {
            document.querySelector("#inputQuote").focus();
        });

        document.querySelector("#submitDeleteQuote").addEventListener("click", (event) => {

            rhit.fbSingleQuotesManager.delete().then(function () {
                console.log("Document successfully deleted!");
                window.location.href = "/list.html"
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });;

        });

        rhit.fbSingleQuotesManager.beginListening(this.updateView.bind(this));
    }

    updateView() {
        document.querySelector("#cardQuote").innerHTML = rhit.fbSingleQuotesManager.quote;
        document.querySelector("#cardMovie").innerHTML = rhit.fbSingleQuotesManager.movie;

        if(rhit.fbAuthManager.author == rhit.fbAuthManager.uid) {
            document.querySelector("#menuEdit").style.display = "flex";
            document.querySelector("#menuDelete").style.display = "flex";

        }
    }
}


// rhit.storage = rhit.storage || {};
// rhit.storage.MOVIEQUOTE_ID_KEY  = "movieQuoteId";
// rhit.storage.getMovieQuoteId = function(){
// 	const mqId = sessionStorage.getItem(rhit.storage.MOVIEQUOTE_ID_KEY);
// 	if(!mqId){
// 		console.log("No movie quote id in sessionStorage!");
// 	}
// 	return mqId;
// };
// rhit.storage.setMovieQuoteId = function(movieQuoteId){
// 	sessionStorage.setItem(rhit.storage.MOVIEQUOTE_ID_KEY,movieQuoteId);
// };

rhit.LoginPageController = class {
    constructor() {
        console.log("You have made the login page controller")
        document.querySelector('#rosefireButton').onclick = (event) => {
            rhit.fbAuthManager.signIn();
        };
    }
}
rhit.FbAuthManager = class {
    constructor() {
        this._user = null;
        //console.log("You have made the auth manager")
    }
    beginListening(changeListener) {
        firebase.auth().onAuthStateChanged((user) => {
            this._user = user;
            changeListener();
        });
    }
    signIn() {
        console.log("Todo: sign in with rosefire");
        Rosefire.signIn("3d48c23b-670a-4ec7-a62f-c5343b4a09ef", (err, rfUser) => {
            if (err) {
                console.log("Rosefire error!", err);
                return;
            }
            console.log("Rosefire success!", rfUser);
            firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/invalid-custom-token') {
                    alert('The token you provide is not valid')
                }else {
                    console.log("Create auth error", errorCode, errorMessage)
                }
                
            });
        });

    }
    signOut() {
        firebase.auth().signOut().catch((error) => {
            // Sign-out successful.
            console.log("You are now signed out");
        });
    }
    get isSignedIn() {
        return !!this._user;
    }
    get uid() {
        return this._user.uid;
    }
}
rhit.checkForRedirects = function() {
    if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
        window.location.href = "/list.html";
    }
    if (!document.querySelector("#loginPage")&& !rhit.fbAuthManager.isSignedIn) {
        window.location.href = "/";
    }
};

rhit.initializePage = function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (document.querySelector("#listPage")) {
        console.log("You are on the list page.");
        const uid = urlParams.get("id");
        rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager(uid);

        new rhit.ListPageController();
    }

    if (document.querySelector("#detailPage")) {
        // console.log("You are on the detail page.");
        const urlParams = new URLSearchParams(queryString)
        const mqId = urlParams.get('id');
        if (!mqId) {
            console.log("Error! Missing movie quote id!");
            window.location.href = "/";
        }
        rhit.fbSingleQuotesManager = new rhit.FbSingleQuoteManager(mqId);
        new rhit.DetailPageController();
    }
    if (document.querySelector("#loginPage")) {
        console.log("You are on the login page.");

        new rhit.LoginPageController();
    }
};
/* Main */
/** function and class syntax examples */
rhit.main = function () {
    console.log("Ready");
    rhit.fbAuthManager = new rhit.FbAuthManager();
    rhit.fbAuthManager.beginListening(() => {
        console.log("auth change callback fired");

        //check for redirects
        rhit.checkForRedirects();

        rhit.initializePage();
    });
    if (document.querySelector("#listPage")) {
        console.log("You are on the list page.");
        rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager();
        new rhit.ListPageController();
    }

    if (document.querySelector("#detailPage")) {
        // console.log("You are on the detail page.");
        // const mqId = rhit.storage.getMovieQuoteId();
        // console.log(`Detail page for ${mqId}`);
        const queryString = window.location.search;
        console.log(queryString);
        const urlParams = new URLSearchParams(queryString)
        const mqId = urlParams.get('id')
        console.log(mqId);
        if (!mqId) {
            console.log("Error! Missing movie quote id!");
            window.location.href = "/";
        }
        rhit.fbSingleQuotesManager = new rhit.FbSingleQuoteManager(mqId);
        new rhit.DetailPageController();
    }
    if (document.querySelector("#loginPage")) {
        console.log("You are on the login page.");

        new rhit.LoginPageController();
    }

};
rhit.main();