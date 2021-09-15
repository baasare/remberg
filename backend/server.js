// filename: server.js

// import necessary libraries
const express = require("express");
const cors = require("cors");
const db = require("./models/index");


// initialize app
const app = express();

const corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));


db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Connected to the database!");

    // clear mongodb
    await db.products.deleteMany({});
    await db.selections.deleteMany({});

    const fs = require('fs');
    // read and parse data
    let data = JSON.parse(fs.readFileSync('data.json'));

    // insert parsed data into mongodb
    db.products.insertMany(data.products);

    db.selections.insertMany([
        {"name": "Machine 3"},
        {"name": "Machine 9"},
        {"name": "Machine 1"},
        {"name": "Machine 6"},
        {"name": "Machine 7"},
    ]);


}).catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

require("./routes/product.route.js")(app);
require("./routes/selection.route.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Remberg server is running on port ${PORT}.`);
});