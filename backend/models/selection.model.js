module.exports = mongoose => {
    let schema = mongoose.Schema({
        name: {
            type: String
        },
    }, {
        collection: 'selection',
        timestamps: true
    })

    return mongoose.model("selections", schema);
};