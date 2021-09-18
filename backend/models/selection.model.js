module.exports = mongoose => {
    let schema = mongoose.Schema({
        _id: {
            type: String
        },
        name: {
            type: String
        },
        company: {
            type: String
        },
    }, {
        collection: 'selection',
        timestamps: true,
        _id: false
    })

    return mongoose.model("selections", schema);
};