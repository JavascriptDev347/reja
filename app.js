const express = require('express');
const app = express();
const db = require("./server").db()

// 1: 📌 Intro code
app.use(express.static("public"));
app.use(express.json());    // serverdan kelayotdan datani json formatga o'tkazib beradi!
app.use(express.urlencoded({extended: true}));  // kelayotdan data ni parse qilib beradi!


// 3: 📌 Views code
app.set("views", "views");  // ikkinchida kelgan views bu folder nomi.
app.set("view engine", "ejs");   // ejs ni ishlatyabmz view engine sifatida.


// 4: 📌 Routing code

app.post("/create-item", (req, res) => {
    console.log(req.body);
    console.log("user entered /create-item");
    const new_reja = req.body.reja;
    db.collection("plans").insertOne({reja: new_reja}, (err, data) => {
        console.log(data.ops);
        res.json(data.ops[0]);
    });
});

app.get("/", function (req, res) {
    console.log("user entered /");
    db.collection("plans").find().toArray((err, data) => {
        if (err) {
            console.log(err);
            res.end("something went wrong");
        } else {
            console.log(data);
            res.render("reja", {items: data});
        }
    })
});


module.exports = app;