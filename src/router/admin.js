const express = require("express");
const Admin = require("../models/Admin");
const auth = require("../middlewares/auth");
const adminRouter = new express.Router();
const verifiedRoles = require("../middlewares/verified_Roles");
const { getSelectedProperties } = require("../helpers/helpers");
adminRouter.get('/getAllAdmins', auth, verifiedRoles('Super Admin'), async (req, res) => {
    try {
        const admins = await Admin.find({})
        const adminsResponse = []
        admins.forEach(admin => {
            const adminsData = getSelectedProperties(admin, ['tokens'])
            adminsResponse.push(adminsData)
        })
        res.status(200).send({ code: 200, admins: adminsResponse })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})



module.exports = adminRouter;
