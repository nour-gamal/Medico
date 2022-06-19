const express = require("express");
const Doctor = require("../models/Doctor");
const auth = require("../middlewares/auth");
const User = require('../models/User')
const { getSelectedProperties } = require("../helpers/helpers");
const doctorRouter = new express.Router();
const verifiedRoles = require("../middlewares/verified_Roles");

doctorRouter.get('/getAllDoctors', auth, verifiedRoles(['Admin', 'Super Admin']), async (req, res) => {
    try {
        const doctors = await Doctor.find({})
        const doctorsResponse = []
        doctors.forEach(doctor => {
            const doctorsData = getSelectedProperties(doctor, ['tokens'])
            doctorsResponse.push(doctorsData)
        })
        res.status(200).send({ code: 200, doctors: doctorsResponse })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

doctorRouter.patch('/editDoctor', auth, verifiedRoles(['Admin', 'Super Admin']), async (req, res) => {
    try {
        const { _id, ...data } = req.body
        await Doctor.findByIdAndUpdate(_id, data, { new: true })
        await User.findByIdAndUpdate(_id, data, { new: true })
        res.status(200).send({ code: 200, message: 'Doctor updated successfully!' })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})
doctorRouter.delete('/deleteDoctor', auth, verifiedRoles(['Admin', 'Super Admin']), async (req, res) => {
    try {
        const { _id } = req.body
        await Doctor.findByIdAndDelete(_id);
        await User.findByIdAndDelete(_id);
        res.status(200).send({ code: 200, message: 'Doctor deleted successfully!' })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

module.exports = doctorRouter;