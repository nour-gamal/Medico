const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');
const { getSelectedProperties } = require('../helpers/helpers');
const jwt = require('jsonwebtoken');
const doctorRouter = require('../router/doctor');
const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    speciality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Speciality'
    },
    gender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gender'
    },
    avatar: {
        type: String
    },
    documents: {
        type: [{
            type: String
        }]
    },
    tokens: {
        type: []
    },
    isActive: {
        type: Boolean
    }
})
doctorSchema.methods.generateJWTToken = async function () {
    const user = this;
    const expirationInSeconds = 60 * 60 * 24; //1 day
    const token = jwt.sign({ _id: user._id.toString(), userType: 2 }, "SecretForMedico", {
        expiresIn: expirationInSeconds,
    });
    user.tokens.push(token);
    await user.save();
    return token;
};

doctorSchema.statics.doctorSignin = async function (_id) {
    try {
        const doctor = await Doctor.findOne({ _id }).populate('gender').populate('speciality');
        if (!doctor) {
            throw new Error()
        }

        const token = await doctor.generateJWTToken();
        const doctorResponse = getSelectedProperties(doctor, ['tokens'], { token })
        return doctorResponse;
    } catch (error) {
        res.status(400).send({ code: 400, message: 'Invalid login attempt!' })
    }
}


doctorSchema.pre('save', async function (next) {
    const doctor = this;
    if (doctor.isModified('password')) {
        doctor.password = await bcrypt.hash(doctor.password, 8)
    }
    next();
})
const Doctor = mongoose.model('Doctor', doctorSchema)
module.exports = Doctor