const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');


mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.products = require("./product.model.js")(mongoose, mongoosePaginate);
db.selections = require("./selection.model.js")(mongoose);

module.exports = db;