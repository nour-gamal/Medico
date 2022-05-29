const express = require('express');
const Speciality = require('../models/Speciality');
const specialityRouter = new express.Router();
const auth = require('../middlewares/auth')

specialityRouter.post('/addSpeciality', auth, async (req, res) => {
    const speciality = new Speciality(req.body)
    try {
        await speciality.save();
        res.status(201).send({ code: 201, message: 'Speciality added successfully!' })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


specialityRouter.get('/getAllSpecialities', auth, async (req, res) => {
    try {
        const specialities = await Speciality.find();
        res.status(200).send({ code: 200, data: specialities });
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }

})

module.exports = specialityRouter


