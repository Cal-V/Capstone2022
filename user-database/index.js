const cors = require('cors');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = 4000;
const routes = require("./routes/routes")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

app.use(cors()); // Tell express to use cors to allow local sites to call your API

app.get("/", function(req, res){
    
});

app.post("/deck/create", routes.createDeck)
app.post("/deck/read", routes.getDeck)
app.post("/deck/delete", routes.deleteDeck)
app.post("/deck/update", routes.updateDeck)

app.post("/api/login",  routes.login)

app.post("/api/signup", routes.signUp)

app.listen(PORT, () => console.log(`Express listening on port: ${PORT}`));