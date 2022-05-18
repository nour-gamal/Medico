const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { getSelectedProperties } = require('../helpers/helpers')
const gender = require('./Gender')
const doctorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a valid email!");
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Please enter a strong password!");
            }
        },
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    speciality: {
        type: [mongoose.Schema.Types.objectId],
        required: true
    },
    gender: {
        type: [mongoose.Schema.Types.objectId],
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
    }
})

doctorSchema.statics.doctorSignup = async function (body) {
    const newDoctor = new Doctor(body);
    try {
        const doctor = await newDoctor.save();
        return 1;
    } catch (error) {
        return error
    }
}
doctorSchema.statics.doctorSignin = async function (email, password) {
    try {
        const doctor = await Doctor.findOne({ email })
        if (!doctor) {
            throw new Error()
        }
        const hashedPassword = doctor.password;
        bcrypt.compare(password, hashedPassword, (err, res) => {
            if (!res) {
                throw new Error()
            }
        });
        const token = await doctor.generateJWTToken();
        const doctorResponse = getSelectedProperties(doctor, ['password', 'tokens'], { token })
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