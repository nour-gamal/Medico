const express = require('express')
const patientRouter = new express.Router()
const User = require('../models/User')
const Patient = require('../models/Patient')
const auth = require('../middlewares/auth')
const verifiedRoles = require("../middlewares/verified_Roles");
const { getSelectedProperties } = require("../helpers/helpers")
const _Admin = process.env.Admin
const Super_Admin = process.env.Super_Admin

patientRouter.get('/getAllPatients', auth, verifiedRoles([_Admin, Super_Admin]), async (req, res) => {
    try {
        const patient = await Patient.find({})
        const patientResponse = []
        patient.forEach(patient => {
            const patientsData = getSelectedProperties(patient, ['tokens'])
            patientResponse.push(patientsData)
        })
        res.status(200).send({ code: 200, patients: patientResponse })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

patientRouter.patch('/editPatient', auth, verifiedRoles([_Admin, Super_Admin]), async (req, res) => {
    try {
        const { _id, ...data } = req.body
        await Patient.findByIdAndUpdate(_id, data, { new: true })
        await User.findByIdAndUpdate(_id, data, { new: true })
        res.status(200).send({ code: 200, message: 'Patient updated successfully!' })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})
patientRouter.delete('/deletePatient', auth, verifiedRoles([_Admin, Super_Admin]), async (req, res) => {
    try {
        const { _id } = req.body
        await Patient.findByIdAndDelete(_id);
        await User.findByIdAndDelete(_id);
        res.status(200).send({ code: 200, message: 'Patient deleted successfully!' })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})



module.exports = patientRouter