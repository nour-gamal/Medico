const mongoose = require('mongoose');
const genderSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        required: true,
    }
})

const Gender = mongoose.model('Gender', genderSchema);
module.exports = Gender