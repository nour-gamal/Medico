const express = require("express");
const commonRouter = new express.Router();
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { getSelectedProperties } = require('../helpers/helpers')
commonRouter.post('/signup', async (req, res) => {
    var status = null;
    const newUser = new User(req.body);

    try {
        const savedUser = await newUser.save();
        let body = { ...req.body, _id: savedUser.id }
        delete body.email
        delete body.password
        const userType = req.body.userType;
        console.log(body);
        switch (userType) {
            case 1:
                await Admin.adminSignup(body);
                res.status(201).send({ code: 201, message: 'Admin is added successfully' })
                break;
            case 2:
                await Doctor.doctorSignup(req.body);
                res.status(201).send({ code: 201, message: 'Doctor is added successfully' })
                break;
            default:
                throw new Error("Invalid user type!")
                break;
        }
        const userTypeName = userType === 1 ? 'Admin' : userType === 2 ? 'Doctor' : 'Patient'
        if (status) {
            res
                .status(201)
                .send({
                    code: 201,
                    message: `${userTypeName} successfully Registered!`,
                });
        }
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }


})

commonRouter.post('/signin', async (req, res) => {
    const { email, password, userType } = req.body;
    const isValidParams = !email || !password || !userType;
    var user = null
    try {
        if (isValidParams) {
            throw new Error()
        }
        switch (userType) {
            case 1:
                user = await Admin.adminSignin(email, password)
                break;
            case 2:
                user = await Doctor.doctorSignin(email, password)
                break;
            default:
                throw new Error()
                break;
        }
        res.status(200).send({ code: 200, data: user })
    } catch (error) {
        res.status(400).send({ code: 400, message: 'Invalid login attempt!' })
    }
})

module.exports = commonRouter;