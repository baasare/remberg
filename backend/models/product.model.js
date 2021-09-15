module.exports = (mongoose, mongoosePaginate) => {
    let schema = mongoose.Schema({
        name: {
            type: String
        },
        company: {
            type: String
        },
    }, {
        collection: 'products'
    })

    schema.plugin(mongoosePaginate)

    return mongoose.model("products", schema);
};