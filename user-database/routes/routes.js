const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rshipman:hmAPz2kSsUgbmph@cluster0.mlus2.mongodb.net/?retryWrites=true&w=majority";

const dbName = "deckbuilder"
const collectionName = "users"

const getIDByUsername = async username => {

    let foundUser;

    const client = await MongoClient.connect(uri)
    try {
        const collection = client.db(dbName).collection(collectionName);
        const query = {username}
        foundUser = await collection.findOne(query)
        //close client
    }catch(err){
        console.log('DAL.getDeckByData')
        console.log(err)
        console.log('/DAL.getDeckByData')
    }finally {
        client.close();
    }
    console.log(foundUser)
    return foundUser?._id;
}

const getUserByUsername = async username => {
    let foundUser;

    const client = await MongoClient.connect(uri)
    try {
        const collection = client.db(dbName).collection(collectionName);
        const query = {username}
        foundUser = await collection.findOne(query)
        //close client
    }catch(err){
        console.log('DAL.getDeckByData')
        console.log(err)
        console.log('/DAL.getDeckByData')
    }finally {
        client.close();
    }
    console.log(foundUser)
    return foundUser;
}

const getUserByID = async id => {
    let foundUser;

    const client = await MongoClient.connect(uri)
    try {
        const collection = client.db(dbName).collection(collectionName);
        const query = {_id: ObjectId(id)}
        foundUser = await collection.findOne(query)
        //close client
    }catch(err){
        console.log('DAL.getDeckByData')
        console.log(err)
        console.log('/DAL.getDeckByData')
    }finally {
        client.close();
    }
    console.log(foundUser)
    return foundUser;
}

exports.login = async (req, res) => {
    let user = req.body.user;
    const foundUser = await getUserByUsername(user.username)
    console.log(foundUser?._id)
    if (foundUser == null) {
        return res.json({error: "Account doesn't exist"})
    }
    //do passwords better
    if (foundUser.password != user.password) {
        return res.json({error: "Incorrect Password"})
    }
    return res.json({uuid: foundUser._id});
};

exports.signUp = async (req, res) => {
    console.log("sign up")
    //post with user data
    let user = req.body.user
    //hash password
    //save new user to database
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
    let newUser = await getUserByUsername(user.username)
    return res.json({uuid: newUser._id})
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