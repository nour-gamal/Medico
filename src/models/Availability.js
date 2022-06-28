const mongoose = require('mongoose')

const availabilitySchema = new mongoose.Schema({
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    availabilities: [{
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },
        period: {
            type: String,
            required: true
        },
        clientID: {
            type: String
        }
    }]
})


const Availability = mongoose.model('Availability', availabilitySchema)
module.exports = Availability