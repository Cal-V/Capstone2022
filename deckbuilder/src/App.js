import './App.css';
import Deckbuilder from './Deckbuilder';
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

  //username and password for the user, probably will change so it's not just saved here
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //user data uuid
  const [user, setUser] = useState();
  //bool for logged in user
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  //setting if there's an error with the login/signup
  const [errorMessage, setErrorMessage] = useState("")

  //holding the user's deck from the database
  const [userDecks,setUserDecks] = useState([])

  //for showing the login modal
  const [loginVisible,setLoginVisible] = useState(false)

  //checking the local storage for the cookie for the user being logged in on load
  useEffect(() => {
    //getting the logged in user from the cookie in local storage if it exists
    const loggedInUser = localStorage.getItem("user");
    //checking if the cookie exists and then updating the user to match
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setIsLoggedIn(true)
    }
    //grabbing the user decks if the user exists
    if (isLoggedIn)
      setDecks()
  }, []);

  //updating the user decks if the user logs in or out
  useEffect(() => {
    if (isLoggedIn)
      setDecks()
  }, [isLoggedIn])

  //setting the user decks based on the id, giving either the decks or an empty array 
  const setDecks = async () => {
    const response = await axios.post(
      "http://localhost:4000/deck/all",
      {uuid: user?.uuid}
    );
    setUserDecks(response.data || [])
  }

  const handleSignUp = async e => {
    //preventing the postback from the form
    e.preventDefault();
    const user = { username, password };
    // send the username and password to my api to add a new user
    const response = await axios.post(
      "http://localhost:4000/api/signup",
      {user: user}
    );
    //checking if there's an error, setting the error message if there is and closing the modal if it's not
    if (!response.data.error) {
      setLoginVisible(false)
      setErrorMessage("")
    } else {
      setErrorMessage(response.data.error)
    }
  }

  //erasing the username and password
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
    <Deckbuilder setUserDecks={setDecks} userDecks={userDecks} errorMessage={{errorMessage,setErrorMessage}} loginVisible={loginVisible} setLoginVisible={setLoginVisible} userMethods={{handleLogout,handleSignUp,handleSubmit,setUsername,username,setPassword,password,resetUserText}} isLoggedIn={isLoggedIn} user={user}/>
  )
}

export default App;
