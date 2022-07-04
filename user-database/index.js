const cors = require('cors');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

app.use(cors()); // Tell express to use cors to allow local sites to call your API

app.get("/", function(req, res){
    
});

app.post("/api/login",  async (req, res) => {
    let user = req.body.user;
    console.log(user)
    return res.json({username: "user"});
});

app.get("/deck/read/:id", async (req,res) => {
    let id = req.params.id;
    deck = await dataHandler.findDeckByID(id)
    console.log(deck)
    res.json(deck)
})

//a8221e42-8a6c-45b3-ba29-c4542cbffd0d

app.get("/deck/delete/:id", async (req,res) => {
    let id = req.params.id
    dataHandler.deleteDeck(id)
    res.redirect("/decks")
})

app.post('/deck/create', async (req, res) => {
    let deckData = req.body.deckData;
    uuid = await dataHandler.addDeck(deckData)
    return res.json({uuid:uuid});
});

app.post('/deck/update/:id', async (req, res) => {
    let id = req.params.id;
    let deckData = req.body.deckData;
    uuid = await dataHandler.updateDeck(id,deckData)
    return res.json({uuid});
});

app.get('/decks', async (req,res) => {
    decks = await dataHandler.getAll();
    res.json(decks)
})

app.listen(PORT, () => console.log(`Express listening on port: ${PORT}`));