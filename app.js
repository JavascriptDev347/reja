const express = require('express');
const app = express();
const db = require("./server").db()
const {ObjectId} = require("mongodb");
// 1: 📌 Intro code
app.use(express.static("public"));
app.use(express.json());    // serverdan kelayotdan datani json formatga o'tkazib beradi!
app.use(express.urlencoded({extended: true}));  // kelayotdan data ni parse qilib beradi!


// 3: 📌 Views code
app.set("views", "views");  // ikkinchida kelgan views bu folder nomi.
app.set("view engine", "ejs");   // ejs ni ishlatyabmz view engine sifatida.


// 4: 📌 Routing code

app.post("/create-item", async (req, res) => {
    try {
        console.log(req.body);
        console.log("user entered /create-item");
        const new_reja = req.body.reja;
        const result = await db.collection("plans").insertOne({reja: new_reja});
        console.log("Result", result);
        res.json({
            reja: new_reja
        });
    } catch (e) {
        console.log("Error in creating item:", e);
    }
});

app.get("/", async function (req, res) {
    try {
        console.log("user entered /");
        // await bilan kutamiz, callback berilmaydi!
        const data = await db.collection("plans").find().toArray();

        console.log("Rejalar:", data);
        res.render("reja", {items: data});
    } catch (err) {
        console.log("Error in getting item:", err);
    }
});

// edit ite
app.post("/edit-item", async (req, res) => {
    try {
        const data = req.body;
        await db.collection("plans").findOneAndUpdate({
            _id: data._id,
    },
        {
            $set: {
                reja: data.new_input,
            }
        }
    )
        ;
        res.json({state: "success"});
    } catch (e) {
        console.log("Error in editing item:", e);
    }
})

// Deleting item
app.post("/delete-item", async (req, res) => {
    try {
        const id = req.body.id;
        await db.collection("plans").deleteOne({_id: new ObjectId(id)});
        res.json("Successfully deleted item");
    } catch (err) {
        console.log("Error in deleting item:", err);
    }
});

//delete all
app.post("/delete-all", async (req, res) => {
    try {
        if (req.body.delete_all) {
            await db.collection("plans").deleteMany()
            res.json({state: "Hamma rejalar o'chirildi"});
        }
    } catch (e) {
        console.log("Error in deleting items:", e);
    }
});

module.exports = app;