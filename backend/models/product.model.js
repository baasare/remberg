module.exports = (mongoose, mongoosePaginate) => {
    let schema = mongoose.Schema({
        name: {
            type: String
        },
        company: {
            type: String
        },
    }, {
        collection: 'products',
        timestamps: true
    })

    schema.plugin(mongoosePaginate)

    return mongoose.model("products", schema);
};