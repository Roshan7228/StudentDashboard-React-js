import React, { useState } from "react";
import "../assets/Login.css";
import GoogleButton from "react-google-button";
import { auth, provider } from "../Firebase/Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate} from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate=useNavigate()
   
  // Google Sign-In Function
  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((response) => {
        console.log(response);
        navigate('/Dashboard')
        setError(""); 
      })
      .catch((error) => {
        console.error(error);
        setError("Google sign-in failed. Please try again.");
      });
  }



  // Email and Password Login Function
  function userEmailLogin(event) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate('/Dashboard')
        setError(""); 
      })
      .catch((error) => {
        console.error(error);
        setError("Invalid email or password. Please try again.");
      });
  }

  return (
    <div>
      <div className="Login-Form">
        <h5>Sign In</h5>
        <p>
          Don’t have an account? <a href="/">Get started</a>
        </p>
        <form onSubmit={userEmailLogin}>
          <label htmlFor="Email">Email *</label>
          <input
            type="text"
            id="Email"
            placeholder="Enter Your Email.."
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="Password">Password *</label>
          <input
            type="password"
            id="Password"
            placeholder="Enter Your Password.."
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign in</button>
        </form>
        
        {error && <p style={{ color: "red",  marginBottom:"5px", marginTop:"5px"}}>{error}</p>}

        <div className="text">
          <h6>OR</h6>
        </div>
        <GoogleButton
          style={{
            width: "100%",
            border: "1px solid black",
            backgroundColor: "transparent",
            color: "black",
          }}
          onClick={signInWithGoogle}
        />
      </div>
    </div>
  );
}

export default Login;
