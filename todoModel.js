const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    createdOn: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Todo', TodoSchema);