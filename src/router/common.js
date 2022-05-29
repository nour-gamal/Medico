const express = require("express");
const commonRouter = new express.Router();
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const { getSelectedProperties, sendEmail } = require('../helpers/helpers')
commonRouter.post('/signup', async (req, res) => {
    var status = null;
    const newUser = new User(req.body);
    try {
        const savedUser = await newUser.save();
        let body = { ...req.body, _id: savedUser.id }
        delete body.email
        delete body.password
        const userType = req.body.userType;
        switch (userType) {
            case 1:
                const newAdmin = new Admin(body);
                await newAdmin.save();
                break;
            case 2:
                const newDoctor = new Doctor(body);
                await newDoctor.save();
                break;
            default:
                throw new Error("Invalid user type!")
                break;
        }
        const userTypeName = userType === 1 ? 'Admin' : userType === 2 ? 'Doctor' : 'Patient'
        res
            .status(201)
            .send({
                code: 201,
                message: `${userTypeName} successfully Registered!`,
            });
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})


commonRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const isValidParams = !email || !password;
    var user = null
    var userData = null
    try {
        if (isValidParams) {
            throw new Error()
        }
        const user = await User.find({ email });
        const hashedPassword = user[0].password;
        if (!user) {
            throw new Error()
        }
        const isMatch = await bcrypt.compare(password, hashedPassword)
        if (!isMatch) {
            throw new Error()
        }

        switch (user[0].userType) {
            case 1:
                userData = await Admin.adminSignin(user[0]._id)
                break;
            case 2:
                userData = await Doctor.doctorSignin(user[0]._id)
                break;
            default:
                throw new Error()
        }

        res.status(200).send({ code: 200, data: userData })
    } catch (error) {
        res.status(400).send({ code: 400, message: 'Invalid login attempt!' })
    }
})

module.exports = commonRouter;