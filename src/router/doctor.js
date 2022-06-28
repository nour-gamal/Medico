const express = require("express");
const Doctor = require("../models/Doctor");
const auth = require("../middlewares/auth");
const User = require('../models/User')
const Availability = require('../models/Availability')
const { getSelectedProperties } = require("../helpers/helpers");
const doctorRouter = new express.Router();
const verifiedRoles = require("../middlewares/verified_Roles");

const _Admin = process.env.Admin
const Super_Admin = process.env.Super_Admin

doctorRouter.get('/getAllDoctors', auth, verifiedRoles([_Admin, Super_Admin]), async (req, res) => {
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

doctorRouter.patch('/editDoctor', auth, verifiedRoles([_Admin, Super_Admin]), async (req, res) => {
    try {
        const { _id, ...data } = req.body
        await Doctor.findByIdAndUpdate(_id, data, { new: true })
        await User.findByIdAndUpdate(_id, data, { new: true })
        res.status(200).send({ code: 200, message: 'Doctor updated successfully!' })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})
doctorRouter.delete('/deleteDoctor', auth, verifiedRoles([_Admin, Super_Admin]), async (req, res) => {
    try {
        const { _id } = req.body
        await Doctor.findByIdAndDelete(_id);
        await User.findByIdAndDelete(_id);
        res.status(200).send({ code: 200, message: 'Doctor deleted successfully!' })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})
doctorRouter.post('/addAvailability', auth, verifiedRoles(['Doctor']), async (req, res) => {
    try {
        await Availability.findByIdAndUpdate(req.user._id, req.body);
        res.status(200).send({ code: 200, message: "Availability Updated Successfully!" })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

module.exports = doctorRouter;