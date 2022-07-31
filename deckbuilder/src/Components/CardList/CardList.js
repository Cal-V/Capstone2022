import React from 'react'
import Card from "./Card/Card.js"
import { useState, useEffect } from 'react'

const CardList = ({cards,getDetailedCard,addToDeck,addMultipleIds}) => {

    //showing the number for pagination
    const [numPerPage, setNumPerPage] = useState(60)
    //the specific indeces shownm
    const [shownIndexes, setShownIndexes] = useState([0,numPerPage]) //incl,excl

    //updating the shown indeces when a new search is loaded
    useEffect(() => {
        setNumPerPage(50)
        setShownIndexes([0,numPerPage])
    },[cards])

    //changing the shown indexes for paging forward
    const handleNextPage = () => {
        if (shownIndexes[0] + numPerPage < cards.length) {
            setShownIndexes([shownIndexes[0]+numPerPage,(shownIndexes[1] + numPerPage < cards.length ? shownIndexes[1]+numPerPage : cards.length)])
        }
    }

     //changing the shown indexes for paging forward
    const handlePrevPage = () => {
        if (shownIndexes[0] > 0) {
            setShownIndexes([shownIndexes[0]-numPerPage,shownIndexes[0]])
        }
    }

    //iterating through and adding all of the shown cards to the current deck
    const addAllToDeck = () => {
        let ids = []
        cards.forEach(card => {
            ids.push({id:card.id})
        });
        addMultipleIds(ids)
    }
    
    return (
        <>
            <div>
                <h3>{cards.length} cards found</h3>
                {(numPerPage < cards.length ? 
                <>
                    {/* showing the page is the forward/back buttons */}
                    <h4>Showing {shownIndexes[0]+1}-{(shownIndexes[1] < cards.length ? shownIndexes[1] : cards.length)} out of {cards.length}</h4>
                    <div>
                        <button className='transform-button' onClick={handlePrevPage}>Previous Page</button>
                        <button className='transform-button' onClick={handleNextPage}>Next Page</button>
                    </div>
                </>
                :
                <></>
                )}
            </div>
            <button className='transform-button' onClick={addAllToDeck}>Add All to Deck</button>
            <div className="list-holder">
                {
                    (cards.length > 0 ?
                    <>
                        {/* showing the cards between the shown page indeces */}
                        {cards.slice(shownIndexes[0],shownIndexes[1]).map((card) => (
                            <Card key={card.id} card={card} getDetailedCard={getDetailedCard} addToDeck={addToDeck}/>
                        ))}
                    </>
                    : <h4>No cards of that search</h4>)
                }
            </div>
            {/* also having forward/back buttons at the bottom of the page */}
            {(numPerPage < cards.length ? 
                <div>
                    <button className='transform-button' onClick={handlePrevPage}>Previous Page</button>
                    <button className='transform-button' onClick={handleNextPage}>Next Page</button>
                </div>
            :
                <></>
            )}
        </>
    )
}

export default CardList