import './App.css';
import Deckbuilder from './Deckbuilder';
import React, { useState, useEffect } from "react";
import axios from "axios";


function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [userDecks,setUserDecks] = useState([])

  const [loginVisible,setLoginVisible] = useState(false)

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setIsLoggedIn(true)
    }
    if (isLoggedIn)
      setDecks()
  }, []);

  useEffect(() => {
    if (isLoggedIn)
      setDecks()
  }, [isLoggedIn])

  const setDecks = async () => {
    const response = await axios.post(
      "http://localhost:4000/deck/all",
      {uuid: user.uuid}
    );
    setUserDecks(response.data)
  }

  const handleSignUp = async e => {
    e.preventDefault();
    const user = { username, password };
    // send the username and password to the server
    const response = await axios.post(
      "http://localhost:4000/api/signup",
      {user: user}
    );
    if (!response.data.error) {
      setLoginVisible(false)
      setErrorMessage("")
    } else {
      setErrorMessage(response.data.error)
    }
  }

  const resetUserText = () => {
    setUsername("");
    setPassword("");
  }

  // logout the user
  const handleLogout = () => {
    setUser();
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
    //checking if there's an error sent by the server
    if (!response.data.error) {
      setLoginVisible(false)
      // set the state of the user
      setUser(response.data);
      setIsLoggedIn(true)
      // store the user in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
      setErrorMessage("")
    } else {
      setErrorMessage(response.data.error)
    }
  };

  return (
    <Deckbuilder userDecks={userDecks} errorMessage={{errorMessage,setErrorMessage}} loginVisible={loginVisible} setLoginVisible={setLoginVisible} userMethods={{handleLogout,handleSignUp,handleSubmit,setUsername,username,setPassword,password,resetUserText}} isLoggedIn={isLoggedIn} user={user}/>
  )
}

export default App;
