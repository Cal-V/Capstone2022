import './App.css';
import Deckbuilder from './Deckbuilder';
import React, { useState, useEffect } from "react";
import axios from "axios";


function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setIsLoggedIn(true)
    }
  }, []);

  const handleSignUp = async e => {
    e.preventDefault();
    const user = { username, password };
    // send the username and password to the server
    const response = await axios.post(
      "http://localhost:4000/api/signup",
      {user: user}
    );
    console.log("sign up")
  }

  // logout the user
  const handleLogout = () => {
    setUser();
    setUsername("");
    setPassword("");
    setIsLoggedIn(false)
    localStorage.clear();
  };

  // login the user
  const handleSubmit = async e => {
    e.preventDefault();
    const user = { username, password };
    // send the username and password to the server
    const response = await axios.post(
      "http://localhost:4000/api/login",
      {user: user}
    );
    console.log(response.data)
    
    //checking if there's an error sent by the server
    if (!response.data.error) {
      // set the state of the user
      setUser(response.data);
      setIsLoggedIn(true)
      // store the user in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
    }
  };

  return (
    <Deckbuilder userMethods={{handleLogout,handleSignUp,handleSubmit,setUsername,username,setPassword,password}} isLoggedIn={isLoggedIn}/>
  )
}

export default App;
