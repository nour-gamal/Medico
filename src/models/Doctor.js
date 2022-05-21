const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');
const { getSelectedProperties } = require('../helpers/helpers');
const jwt = require('jsonwebtoken');
const doctorRouter = require('../router/doctor');
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

doctorSchema.statics.doctorSignup = async function (body) {
    const newDoctor = new Doctor(body);
    try {
        await newDoctor.save();
    } catch (error) {
        throw new Error(error.message)
    }
}
doctorSchema.statics.doctorSignin = async function (email, password) {
    try {
        const doctor = await Doctor.findOne({ email }).populate('gender').populate('speciality');
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
        const doctorResponse = getSelectedProperties(doctor, ['password', 'tokens', 'gender', 'speciality'], { token, gender: doctor.gender.type, speciality: doctor.speciality.name })
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