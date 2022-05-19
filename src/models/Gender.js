const mongoose = require('mongoose');
const genderSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        required: true,
    }
})
genderSchema.virtual('gender', {
    ref: 'Doctor',
    localField: '_id',
    foreignField: 'gender'
})

const Gender = mongoose.model('Gender', genderSchema);
module.exports = Gender