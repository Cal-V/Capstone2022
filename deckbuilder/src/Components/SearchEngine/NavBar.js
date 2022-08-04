import React from 'react'

function NavBar({getCardData,searchTerm,handleSearch,setSearchTerm,setOrder,setDirection,order,direction,setLoginVisible,handleLogout,isLoggedIn,loginVisible}) {
    return (
        <nav>
            <button className='nav-button nav-item' onClick={() => {getCardData(`https://api.scryfall.com/cards/random?q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}`)}}>I'm feeling lucky</button>
            <form className='search-form' onSubmit={handleSearch}>
            <input id="search-bar" type="text" className='nav-item' value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            <input id="search-button" className='nav-button nav-item' type="submit" value="Search" />
            </form>
            <select className='nav-item nav-select' value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="name">Name</option>
            <option value="set">Set</option>
            <option value="released">Date</option>
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
            {/* <button className='nav-button nav-item' onClick={() => setSeeDeck(!seeDeck)}>{(seeDeck ? "Go Back" : "See Deck")}</button> */}
            <button className='nav-button nav-item' onClick={() => {getCardData("https://api.scryfall.com/cards/random")}}>Random Card</button>
            {isLoggedIn ? 
                <button className='nav-button nav-item nav-button-right' onClick={() => handleLogout()}>Logout</button>
                :
                <button className='nav-button nav-item nav-button-right' onClick={() => setLoginVisible(!loginVisible)}>Login/Signup</button>
            }
            
        </nav>
    )
}

export default NavBar