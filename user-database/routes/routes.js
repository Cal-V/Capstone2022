const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rshipman:hmAPz2kSsUgbmph@cluster0.mlus2.mongodb.net/?retryWrites=true&w=majority";

const dbName = "deckbuilder"
const collectionName = "users"

const getIDByUsername = async username => {

    let foundUser;

    console.log(username)

    const client = await MongoClient.connect(uri)
    try {
        const collection = client.db(dbName).collection(collectionName);
        const query = {username}
        console.log(query)
        foundUser = await collection.findOne(query)
        console.log(foundUser)
        //close client
    }catch(err){
        console.log('DAL.getDeckByData')
        console.log(err)
        console.log('/DAL.getDeckByData')
    }finally {
        client.close();
    }
    return foundUser._id;
}

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
    console.log(req.body.user)
    const client = await MongoClient.connect(uri)

    try {
        const collection = client.db(dbName).collection(collectionName);
        await collection.insertOne(user)
        //close client
    }catch(err){
        console.log(`${user} signed up`)
        console.log(err)
        console.log(`/${user} signed up`)
    }finally {
        client.close();
    }
    let uuid = await getIDByUsername(user.username)
    return res.json({uuid})
}

exports.addDeck = async (req, res) => {
    //post with user uuid and deck data (body.user, body.deck)
    //create uuid for deck
    //modify the user data in the database to add the deck

    //https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
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