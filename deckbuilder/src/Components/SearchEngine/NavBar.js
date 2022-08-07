import React from 'react'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function NavBar({updateSearchQuery,getRandomCard,setLoginVisible,handleLogout,isLoggedIn,loginVisible,deckUUID}) {

    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("name");
    const [direction, setDirection] = useState("auto");

    const navigate = useNavigate()

    return (
        <nav>
            <button className='nav-button nav-item' onClick={() => {getRandomCard(searchTerm)}}>I'm feeling lucky</button>
            <form className='search-form' onSubmit={() => updateSearchQuery(order,direction,searchTerm)}>
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
            {isLoggedIn ? 
                <button className='nav-button nav-item nav-button-right' onClick={() => handleLogout()}>Logout</button>
                :
                <button className='nav-button nav-item nav-button-right' onClick={() => setLoginVisible(!loginVisible)}>Login/Signup</button>
            }
            
        </nav>
    )
}

export default NavBar