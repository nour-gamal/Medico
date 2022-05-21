const mongoose = require('mongoose');


const specialitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
})
specialitySchema.virtual('speciality', {
    ref: 'Doctor',
    foreignField: 'speciality',
    localField: '_id'
})

const Speciality = mongoose.model('Speciality', specialitySchema)

module.exports = Speciality