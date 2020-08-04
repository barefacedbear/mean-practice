const mongoose = require('mongoose');

// creating schema(table columns)
const postSchema = mongoose.Schema({
    title: { type: String, required: true},
    body: { type: String, required: true},
    imagePath: String
});

// passing the schema blueprint into a model(data table)
module.exports = mongoose.model('Post', postSchema);