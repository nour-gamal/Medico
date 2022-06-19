const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const auth = async (req, res, next) => {
	try {
		if (!req.header("Authorization")) {
			throw new Error()
		}
		const token = req.header("Authorization").replace("Bearer ", "");

		if (!token) {
			throw new Error()
		}
		const tokenData = jwt.verify(token, 'SecretForMedico');
		const { _id, userType } = tokenData;
		if (userType === 1) {
			const admin = await Admin.findOne({ _id, tokens: token, userType })
			if (!admin) {
				throw new Error()
			}
			req.user = admin, req.token = token
			next();
		} else if (userType === 2) {
			const doctor = await Doctor.findOne({ _id, userType, tokens: token })
			if (!doctor) {
				throw new error()
			}
			req.user = doctor, req.token = token
			next()
		} else {
			throw new Error()
		}

	} catch (error) {
		res.status(401).send({ code: 401, message: 'Invalid token!' })
	}
};

module.exports = auth;
