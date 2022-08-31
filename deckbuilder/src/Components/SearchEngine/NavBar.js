import React from 'react'
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import "./Nav.css"

function NavBar({updateSearchQuery,getRandomCard,setLoginVisible,handleLogout,isLoggedIn,loginVisible,deckUUID,deck,deckInfo,searchTerm, setSearchTerm}) {

    const [order, setOrder] = useState("name");
    const [direction, setDirection] = useState("auto");

    const navigate = useNavigate()

    useEffect(() => {
        console.log(order,direction,searchTerm)
        updateSearchQuery(order,direction,searchTerm)
    },[order,direction])

    return (
        <>
            <nav>
                {deck.length > 0 ? <p id="deck-label" className='nav-item'>Current Deck: <strong><a className='nav-text' onClick={() => navigate(`/deck${(deckUUID?.length > 1 ? `/${deckUUID}` : "")}`)}>{deckInfo.name}</a></strong></p> : <></>}
                <button className='nav-button nav-item' onClick={() => {getRandomCard(searchTerm)}}>I'm feeling lucky</button>
                <form className='search-form' onSubmit={(evt) => {evt.preventDefault();updateSearchQuery(order,direction,searchTerm)}}>
                    <input id="search-bar" type="text" className='nav-item' value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                    <input id="search-button" className='nav-button nav-item' type="submit" value="Search" />
                </form>
                <select className='nav-item nav-select' value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value="set">Set</option>
                    <option value="released">Date</option>
                    <option value="name">Name</option>
                    <option value="color">Color</option>
                    <option value="usd">Price (usd)</option>
                    <option value="cmc">Mana Value</option>
                    <option value="power">Power</option>
                    <option value="toughness">Toughness</option>
                </select>
                <select className='nav-item nav-select' value={direction} onChange={(e) => setDirection(e.target.value)}>
                    <option value="auto">Auto</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Desceding</option>
                </select>
                <button className='nav-button nav-item' onClick={() => navigate(`/deck${(deckUUID?.length > 1 ? `/${deckUUID}` : "")}`)}>See Deck</button>
                <button className='nav-button nav-item' onClick={() => getRandomCard()}>Random Card</button>
                <button className='nav-button nav-item' onClick={() => navigate("/advanced")}>Advanced Search</button>
                {isLoggedIn ? 
                    <button className='nav-button nav-item nav-button-right' onClick={() => handleLogout()}>Logout</button>
                    :
                    <button className='nav-button nav-item nav-button-right' onClick={() => setLoginVisible(!loginVisible)}>Login/Signup</button>
                }
                
            </nav>
            <div className='nav-spacer'></div>
        </>
    )
}

export default NavBar