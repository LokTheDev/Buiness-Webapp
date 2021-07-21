const express           = require("express");
const bodyParser        = require("body-parser");
const ejs               = require("ejs");
const app               = express();
const mongoose          =require("mongoose");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/manageDB', {useNewUrlParser: true, useUnifiedTopology: true});

const loginSchema = new mongoose.Schema({
    name: String,
    password: String
});

const Login = mongoose.model("Login", loginSchema);

//apply newUSER
app.get("/register", function(req, res){
    res.render("regis.ejs")
});

app.post("/register", function(req, res){
    const inputID = req.body.userID   //work
    const inputPW = req.body.userPW   //work
    const newUser = new Login({
        name: inputID,
        password: inputPW
    });

    newUser.save().then(() => console.log('newUserAdded'));

    res.redirect("/")
})


//login
let login = false


app.get("/", function(req, res){
    res.render("login")
    login=false
});

app.post("/", function(req, res){
    const inputID = req.body.userID   //work
    const inputPW = req.body.userPW   //work
    
    Login.findOne({name: inputID}, function(err, foundUser){
        if(foundUser){
                if(foundUser.password === inputPW){
                    login= true
                    res.redirect("/main");
                }
            }else{res.redirect("/reject")}
        }
    )
    })

//main

const itemSchema = new mongoose.Schema({
    name: String,
    stock: Number,
    price: Number,
    img: String
});

const Item = mongoose.model("Item", itemSchema);


app.get("/main", function(req, res) {
    if(login){

    Item.find({}, function(err, foundItems){
      
      res.render("main", {listTitle: "Today", stockItems: foundItems});

    })}
    else{
        res.redirect("/")
    }
})


//create
app.get("/create", function(req, res) {
    if(login){
    res.render("create")}
    else{res.redirect("/")}   
});

app.post("/create", function(req, res) {
    const inputName = req.body.itemName  //work
    const inputStock = req.body.itemStock   //work
    const inputPrice = req.body.itemPrice   //work
    const inputImg = req.body.itemImg   //work

    const newItem = new Item({
        name: inputName,
        stock: inputStock,
        price: inputPrice,
        img: inputImg
    });

    newItem.save().then(() => console.log('newItem Added!'));

    res.redirect("/main")
});

//update/

app.get("/update", function(req, res){
    if(login){
    res.render("update")}
    else{res.redirect("/")}   
})

app.post("/update", function(req, res) {
   
   Item.findOneAndUpdate({name: req.body.itemName},{stock: req.body.itemStock, price: req.body.itemPrice, img: req.body.itemImg},{useFindAndModify: false},(err) =>{
       if(err){
           console.log(err)
       }else(console.log("stockUpdated"))
   })

    res.redirect("/main")
});

//delete
app.get("/delete", function(req, res){
    if(login){
    res.render("delete")
    }else{res.redirect("/")}   
})

app.post("/delete", function(req, res) {
   
   Item.findOneAndDelete({name: req.body.itemName},(err) =>{
       if(err){
           console.log(err)
       }else(console.log("stockDelete"))
   })

    res.redirect("/main")
});

//reject
app.get("/reject", function(req, res){
    res.render("reject")
})


app.listen(3000, function(){
    console.log("Server Running On Port:3000")
});

