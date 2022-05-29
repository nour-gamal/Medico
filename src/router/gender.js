const express = require("express");
const Gender = require("../models/Gender");
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const genderRouter = new express.Router();


genderRouter.get('/getAllGenders', adminAuth, async (req, res) => {
    try {
        const gender = await Gender.find({});
        res.status(200).send({ code: 200, gender })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})
module.exports = genderRouter
