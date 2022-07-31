const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//link to my database
const uri = "mongodb+srv://rshipman:hmAPz2kSsUgbmph@cluster0.mlus2.mongodb.net/?retryWrites=true&w=majority";

//database and collection name to keep as variables
const dbName = "deckbuilder"
const collectionName = "users"


const getUserByUsername = async username => {
    let foundUser;

    //open client
    const client = await MongoClient.connect(uri)
    try {
        const collection = client.db(dbName).collection(collectionName);
        //trying to match user in the database with given username
        const query = {username}
        foundUser = await collection.findOne(query)
    }catch(err){
        //log error with context if there is one
        console.log('DAL.getUserByUsername')
        console.log(err)
        console.log('/DAL.getUserByUsername')
    }finally {
        //always closing client
        client.close();
    }
    return foundUser;
}

//same as prev method but id instead of username
const getUserByID = async id => {
    let foundUser;

    const client = await MongoClient.connect(uri)
    try {
        const collection = client.db(dbName).collection(collectionName);
        const query = {_id: ObjectId(id)}
        foundUser = await collection.findOne(query)
    }catch(err){
        console.log('DAL.getUserByID')
        console.log(err)
        console.log('/DAL.getUserByID')
    }finally {
        client.close();
    }
    return foundUser;
}

//login route
exports.login = async (req, res) => {
    //grabbing the user data from the post
    let user = req.body.user;
    //trying to grab matching user from the database
    const foundUser = await getUserByUsername(user.username)
    if (foundUser == null) {
        //sending error if the user doesn't exist
        return res.json({error: "Account doesn't exist"})
    }
    ////do passwords better////
    //checking for a password match
    if (foundUser.password != user.password) {
        return res.json({error: "Incorrect Password"})
    }
    //returing the user id from the database
    return res.json({uuid: foundUser._id});
};

//sign up route
exports.signUp = async (req, res) => {
    //grabbing the user data from the post
    let user = req.body.user

    //sending an error if the username already exists
    if (getUserByUsername(user.username)) {
        return res.json({error:"Username already exists"})
    }
    
    //creating a user entry based on the data given, including a decks array so it's already there
    let userEntry = {
        username: user.username,
        password: user.password,
        decks: []
    }
    //hash password
    //save new user to database

    const client = await MongoClient.connect(uri)

    //same overall database functions with the try/catch/finally
    try {
        const collection = client.db(dbName).collection(collectionName);
        //adding the new user
        await collection.insertOne(userEntry)
    }catch(err){
        console.log(`${user.username} signed up`)
        console.log(err)
        console.log(`/${user.username} signed up`)
    }finally {
        client.close();
    }
    let newUser = await getUserByUsername(userEntry.username)
    //returning the uuid to be used in the front end
    return res.json({uuid: newUser._id})
}

const addDeck = async (uuid,deckData,deckInfo,id) => {
    //getting the user from the passed in id
    let user = await getUserByID(uuid)

    const client = await MongoClient.connect(uri)
    
    //making a new deckid if one wasn't passed in
    //for either updating a deck or adding a new one
    const deckId = id || ObjectId()

    let result;

    //same overall database functions with the try/catch/finally
    try {
        const collection = client.db(dbName).collection(collectionName);
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        //either adding the new deck or updating the current one
        const updateDoc = {
            $set: {
                decks: [...user.decks,{_deck_id: deckId,cards:deckData,deck_info:deckInfo}]
            },
        };
        //updating with the new data
        result = await collection.updateOne({_id:ObjectId(uuid)}, updateDoc, options);
        //close client
    }catch(err){
        console.log('DAL.createDeck')
        console.log(err)
        console.log('/DAL.createDeck')
    }finally {
        client.close();
    }
    return deckId
}

//create deck route
exports.createDeck = async (req, res) => {
    //calling the addDeck method with post data passed in
    let uuid = req.body.uuid
    let deckData = req.body.deckData
    let deckInfo = req.body.deckInfo
    const deckId = await addDeck(uuid,deckData,deckInfo)
    res.json(deckId)
}

const updateDeck = async (uuid,deckId,deckData,deckInfo) => {
    //deletes then adds the passed in deck with the new data
    let id = await deleteDeck(uuid,deckId);
    let nextid = await addDeck(uuid,deckData,deckInfo,deckId)
    return nextid;
}

//update deck route
exports.updateDeck = async (req, res) => {
    //reads in the data then calls the updateDeck method
    let uuid = req.body.uuid
    let deckData = req.body.deckData
    let deckInfo = req.body.deckInfo
    const deckId = req.body.deckId
    console.log(deckInfo)
    const id = await updateDeck(uuid,deckId,deckData,deckInfo)
    res.json(id)
}

const deleteDeck = async (uuid,deckId) => {
    //gets passed in user then grabs the array of decks not including the deck passed in
    let user = await getUserByID(uuid)
    const keptDecks = Array.from(user.decks).filter(deck => deck._deck_id.toString() != deckId)
    const client = await MongoClient.connect(uri)
    let result;

    //same overall database functions with the try/catch/finally
    try {
        const collection = client.db(dbName).collection(collectionName);
        // this option instructs the method to create a document if no documents match the filter
        const updateDoc = {
            $set: {
                decks: keptDecks
            },
        };
        //updates user's deck array with the keptDecks
        result = await collection.updateOne({_id:ObjectId(uuid)}, updateDoc);
        //close client
    }catch(err){
        console.log('DAL.deleteDeck')
        console.log(err)
        console.log('/DAL.deleteDeck')
    }finally {
        client.close();
    }
    console.log("deck deleted")
    return deckId
}

//delete deck route
exports.deleteDeck = async (req, res) => {
    //calls the deleteDeck method with the passed in uuid and deckId
    let uuid = req.body.uuid
    let deckId = req.body.deckId
    deleteDeck(uuid,deckId)
}

//get deck route
exports.getDeck = async (req, res) => {
    //returns the deck found from the user matching the uuid and deckId
    const uuid = req.body.uuid;
    const deckId = req.body.deckId
    console.log("load deck")
    console.log(deckId)

    const user = await getUserByID(uuid);
    const decks = Array.from(user.decks);
    const result = decks.filter(deck => deck._deck_id.toString() == deckId)
    console.log(result[0]?.deck_info)
    return res.json(result[0])
}

//get all decks route
exports.getAllDecks = async (req, res) => {
    //returns entire decks array from passed in user from the uuid
    const uuid = req.body.uuid;
    if (uuid) {
        const user = await getUserByID(uuid);
        console.log(user)
        const decks = Array.from(user.decks);
        return res.json(decks)
    }
    return
} 