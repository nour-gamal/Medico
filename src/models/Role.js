const mongoose = require('mongoose');


const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
})

roleSchema.virtual('role', {
    ref: 'Admin',
    foreignField: 'role',
    localField: '_id'
})

const Role = mongoose.model('Role', roleSchema);
module.exports = Role