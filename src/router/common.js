const express = require("express");
const commonRouter = new express.Router()
const Admin = require('../models/Admin')
const auth = require("../middlewares/auth");


commonRouter.post('/signup', async (req, res) => {
    const { userType } = req.body;
    var status = null;
    try {
        if (!userType) {
            throw new Error("Please provide user type!")
        }
        switch (userType) {
            case 1:
                status = Admin.adminSignup(req.body);
                console.log(status.response)
                if (status !== 1) {
                    throw new Error(status.message)
                }
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