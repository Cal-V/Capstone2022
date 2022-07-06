const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rshipman:hmAPz2kSsUgbmph@cluster0.mlus2.mongodb.net/?retryWrites=true&w=majority";

const dbName = "deckbuilder"
const collectionName = "users"



exports.login = async (req, res) => {
    let user = req.body.user;
    console.log(user)
    return res.json({uuid: "user"});
};

exports.signUp = async (req, res) => {
    //post with user data
    let user = req.body.user
    //hash password
    //save new user to database
    console.log("User Sign Up")
    const client = await MongoClient.connect(uri)

    try {
        const collection = client.db(dbName).collection(collectionName);
        await collection.insertOne({deck:deckData})
        //close client
    }catch(err){
        console.log('DAL.createDeck')
        console.log(err)
        console.log('/DAL.createDeck')
    }finally {
        client.close();
    }
    let uuid = await getIDByData(deckData)
    return uuid
}

exports.addDeck = async (req, res) => {
    //post with user uuid and deck data (body.user, body.deck)
    //create uuid for deck
    //modify the user data in the database to add the deck
}

exports.updateDeck = async (req, res) => {
    //post with user uuid and deck data (including deck uuid)
    //update that deck within that user's data in the database
}

exports.deleteDeck = async (req, res) => {
    //post with user uuid and deck uuid
    //delete deck with that uuid
}

exports.getDeck = async (req, res) => {
    //post with user uuid and deck uuid
    //return deck data for that deck (json)
}

exports.getAllDecks = async (req, res) => {
    //post with user uuid
    //return all decks for that user (json)
}