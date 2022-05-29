const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const adminAuth = async (req, res, next) => {
    const token = req.header("Authorization").replace('Bearer ', "")
    try {
        if (!token) {
            throw new Error()
        }
        tokenData = jwt.verify(token, 'SecretForMedico');
        const { _id, userType, role } = tokenData;
        const admin = await Admin.findOne({ _id });
        console.log(admin)
        next()
    } catch (error) {
        res.status(400).send({ code: 400, message: "Invalid token!" })
    }
}

module.exports = adminAuth