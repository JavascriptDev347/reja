const http = require('http');
const {MongoClient} = require('mongodb');

// mongodb connection
let db;
const connectionString = "mongodb://localhost:27017/Reja";

MongoClient.connect(connectionString).then(client => {
    console.log("Connected to MongoDB");
    // Database ni oling (URI da "Reja" deb ko'rsatilgan, shuning uchun)
    db = client.db("Reja");  // yoki client.db() — avto aniqlaydi

    // Endi db ni eksport qilamiz (funksiya orqali)
    module.exports = {
        db: () => db   // db() funksiyasi orqali olish
        // yoki to'g'ridan-to'g'ri db ni berish uchun: db
    };
    const app = require("./app");
    const PORT = 3000;
    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log("Server listening on port " + PORT);
    })

}).catch(err => {
    console.log("MongoDB connection error:" + err);
})

