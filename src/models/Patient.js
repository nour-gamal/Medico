const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { getSelectedProperties } = require('../helpers/helpers');

const patientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gender'
    },
    avatar: {
        type: String
    },
    tokens: {
        type: []
    }
})

patientSchema.methods.generateJWTToken = async function () {
    const user = this;
    const expirationInSeconds = 60 * 60 * 24; //1 day
    const token = jwt.sign({ _id: user._id.toString(), userType: 3 }, "SecretForMedico", {
        expiresIn: expirationInSeconds,
    });
    user.tokens.push(token);
    await user.save();
    return token;
};

patientSchema.pre('save', async function (next) {
    const patient = this;
    if (patient.isModified('password')) {
        patient.password = await bcrypt.hash(patient.password, 8)
    }
    next();
})


patientSchema.statics.patientSignin = async function (_id) {
    try {
        const patient = await Patient.findOne({ _id }).populate('gender')
        if (!patient) {
            throw new Error()
        }

        const token = await patient.generateJWTToken();
        const patientResponse = getSelectedProperties(patient, ['tokens'], { token })

        return patientResponse;
    } catch (error) {
        res.status(400).send({ code: 400, message: 'Invalid login attempt!' })
    }
}

const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient
