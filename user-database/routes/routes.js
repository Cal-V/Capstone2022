const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rshipman:hmAPz2kSsUgbmph@cluster0.mlus2.mongodb.net/?retryWrites=true&w=majority";

const dbName = "deckbuilder"
const collectionName = "users"

const getUserByUsername = async username => {
    let foundUser;

    const client = await MongoClient.connect(uri)
    try {
        const collection = client.db(dbName).collection(collectionName);
        const query = {username}
        foundUser = await collection.findOne(query)
        //close client
    }catch(err){
        console.log('DAL.getUserByUsername')
        console.log(err)
        console.log('/DAL.getUserByUsername')
    }finally {
        client.close();
    }
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
        console.log('DAL.getUserByID')
        console.log(err)
        console.log('/DAL.getUserByID')
    }finally {
        client.close();
    }
    return foundUser;
}

exports.login = async (req, res) => {
    let user = req.body.user;
    const foundUser = await getUserByUsername(user.username)
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
    //post with user data
    let user = req.body.user
    let userEntry = {
        username: user.username,
        password: user.password,
        decks: []
    }
    //hash password
    //save new user to database
    const client = await MongoClient.connect(uri)

    try {
        const collection = client.db(dbName).collection(collectionName);
        await collection.insertOne(userEntry)
        //close client
    }catch(err){
        console.log(`${user.username} signed up`)
        console.log(err)
        console.log(`/${user.username} signed up`)
    }finally {
        client.close();
    }
    let newUser = await getUserByUsername(userEntry.username)
    return res.json({uuid: newUser._id})
}

const addDeck = async (uuid,deckData,deckInfo,id) => {
    console.log(deckInfo)
    let user = await getUserByID(uuid)
    const client = await MongoClient.connect(uri)
    const deckId = id || ObjectId()
    let result;
    try {
        const collection = client.db(dbName).collection(collectionName);
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                decks: [...user.decks,{_deck_id: deckId,cards:deckData,deck_info:deckInfo}]
            },
        };
        result = await collection.updateOne({_id:ObjectId(uuid)}, updateDoc, options);
        //close client
    }catch(err){
        console.log('DAL.createDeck')
        console.log(err)
        console.log('/DAL.createDeck')
    }finally {
        client.close();
    }
    console.log("deck added")
    return deckId
}

exports.createDeck = async (req, res) => {
    console.log("create deck")
    let uuid = req.body.uuid
    let deckData = req.body.deckData
    let deckInfo = req.body.deckInfo
    const deckId = await addDeck(uuid,deckData,deckInfo)
    res.json(deckId)
}

const updateDeck = async (uuid,deckId,deckData,deckInfo) => {
    let id = await deleteDeck(uuid,deckId);
    let nextid = await addDeck(uuid,deckData,deckInfo,deckId)
    return nextid;
}

exports.updateDeck = async (req, res) => {
    console.log("update deck")
    let uuid = req.body.uuid
    let deckData = req.body.deckData
    let deckInfo = req.body.deckInfo
    const deckId = req.body.deckId
    console.log(deckInfo)
    const id = await updateDeck(uuid,deckId,deckData,deckInfo)
    res.json(id)
}

const deleteDeck = async (uuid,deckId) => {
    let user = await getUserByID(uuid)
    const keptDecks = Array.from(user.decks).filter(deck => deck._deck_id.toString() != deckId)
    const client = await MongoClient.connect(uri)
    let result;
    try {
        const collection = client.db(dbName).collection(collectionName);
        // this option instructs the method to create a document if no documents match the filter
        const updateDoc = {
            $set: {
                decks: keptDecks
            },
        };
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

exports.deleteDeck = async (req, res) => {
    console.log("delete deck")
    let uuid = req.body.uuid
    let deckId = req.body.deckId
    deleteDeck(uuid,deckId)
}

exports.getDeck = async (req, res) => {
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

exports.getAllDecks = async (req, res) => {
    const uuid = req.body.uuid;
    const user = await getUserByID(uuid);
    console.log(user)
    const decks = Array.from(user.decks);
    return res.json(decks)
} 