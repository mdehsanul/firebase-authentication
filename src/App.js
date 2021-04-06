import React, { useState } from "react";
import "./App.css";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
// Add firebaseConfig when Initialize Firebase
import firebaseConfig from "./configs/firebase.config";

// if firebase initialize 2 time then for avoid error need to write this condition
if (firebase.apps.length === 0) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

function App() {
  // useState()
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
    success: false,
  });
  // -------------------------------------------------------------------- Start Implementation using Firebase ---------------------------------------------------------------------
  // Create an instance of the Google provider object
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  // Create an instance of the Facebook provider object
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  // Create an instance of the GitHub provider object
  var githubProvider = new firebase.auth.GithubAuthProvider();

  // Google Sign In using firebase -----------------------------------------
  const handleSignIn = () => {
    // To sign in with a Google pop-up window, call signInWithPopup
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        const isSignedIn = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(isSignedIn);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };

  // Google Sign Out  using firebase-------------------------------------------
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        const isSignedOut = {
          isSignedIn: false,
          name: "",
          email: "",
          photo: "",
        };
        setUser(isSignedOut);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };

  // Facebook Sign In using firebase -----------------------------------------
  const handleFbSignIn = () => {
    // To sign in with a Facebook pop-up window, call signInWithPopup:
    firebase
      .auth()
      .signInWithPopup(facebookProvider)
      .then((result) => {
        var user = result.user;
        setUser(user);
        console.log(user);
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  // GitHub Sign In using firebase -----------------------------------------
  const handleFGithubSignIn = () => {
    // To sign in with a GitHub pop-up window, call signInWithPopup:
    firebase
      .auth()
      .signInWithPopup(githubProvider)
      .then((result) => {
        var user = result.user;
        setUser(user);
        console.log(user);
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };
  // -------------------------------------------------------------------- End Implementation using Firebase  --------------------------------------------------------------------------

  // -------------------------------------------------------------------- Start Implementation Mnually ---------------------------------------------------------------------------------

  // email, password validation Maually when email, password write in the input box ---------------------------------
  const handleBlur = (event) => {
    // console.log(event.target.name, event.target.value);
    // debugger;
    let isFieldValid = true;
    if (event.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === "password") {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      //[...cart, newItem]
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  };

  // when form is submitted --------------------------------------------
  const handleSubmit = (event) => {
    // console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      // creating User With Email And Password in firebase (a little work with firebase when working  manually)
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((response) => {
          // Signed in
          const newUserInfo = { ...user };
          newUserInfo.error = " ";
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    // signIn With Email And Password
    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((response) => {
          const newUserInfo = { ...user };
          newUserInfo.error = " ";
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log("Sign in user info:", response.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    // prevent auto page loading when submit button click
    event.preventDefault();
  };

  const updateUserName = (name) => {
    var user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: name,
      })
      .then(function () {
        // Update successful.
        console.log("User name updated successfully");
      })
      .catch(function (error) {
        // An error happened.
        console.log(error);
      });
  };

  // -------------------------------------------------------------------- End Implementation Mnually  ----------------------------------------------------------------------------------

  return (
    // ------------------------------ start firebase --------------------------------------
    <div className="App">
      {/* conditional signIn, signOut */}
      {user.isSignedIn ? (
        // Sign Out buton
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        // Sign In Button
        <button onClick={handleSignIn}>Sign In</button>
      )}
      <br />
      <button onClick={handleFbSignIn}>Log in using Facebook</button>
      <br />
      <button onClick={handleFGithubSignIn}>Log in using GitHub</button>

      {/* showing user Information when user SignedIn */}
      {user.isSignedIn && (
        <div>
          <p> Welcome {user.name} </p>
          <p>your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      {/*--------------------------- End firebase ------------------------------------------*/}

      {/*--------------------------- Start Manual ------------------------------------------*/}
      <h1>Our own authontication</h1>
      {/* initial work of useState() -> "newUser" and "setNewUser" start from here.... */}
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)} /******/
        name="newUser" /*****/
      />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            name="name"
            type="text"
            onBlur={handleBlur}
            placeholder="your name"
          />
        )}
        <br />
        <input
          type="text"
          // onChange={handleChange}
          onBlur={handleBlur}
          name="email"
          placeholder="your email address"
          required
        />
        <br />
        <input
          type="password"
          // onChange={handleChange}
          onBlur={handleBlur}
          name="password"
          placeholder="your password"
        />
        <br />
        <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "green" }}>
          User {newUser ? "Created" : "Logged In"} Successfully
        </p>
      )}

      {/*--------------------------- End Manual ------------------------------------------*/}
    </div>
  );
}

export default App;
