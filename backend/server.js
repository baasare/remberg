// filename: server.js

// import necessary libraries
const express = require("express");
const cors = require("cors");
const db = require("./models/index");


// initialize app
const app = express();

const corsOptions = {
    origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));


db.mongoose.connect(db.url).then(async () => {
    console.log("Connected to the database!");

    // clear mongodb
    await db.products.deleteMany({});
    await db.selections.deleteMany({});

    const fs = require('fs');
    // read and parse data
    const file = fs.readFileSync(__dirname + '/data.json');
    let data = JSON.parse(file);

    // insert parsed data into mongodb
    db.products.insertMany(data.products);


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