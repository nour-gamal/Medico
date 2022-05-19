const express = require('express')
const Doctor = require('../models/Doctor')
const doctorRouter = new express.Router()


doctorRouter.get('/doctor/getGenderName', async (req, res) => {
    try {
        const doctor = await Doctor.find({ email: "nfsddfdd@em.com" }).populate("gender")
            .exec(function (err, results) {
                console.log(result)
            })

    } catch (error) {
        console.log(error.message)
    }
})

module.exports = doctorRouter