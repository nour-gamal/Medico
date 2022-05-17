const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const auth = async (req, res, next) => {
	const token = req.header("Authorization").split("Bearer ")[1];
	try {
		const tokenData = jwt.verify(token, 'SecretForMedico');
		const { _id } = tokenData;
		const userType = req.body.userType === 0 ? Admin : req.body.userType === 1 ? Doctor ? req.body.userType === '2' ? Patient : null : null : null

		if (userType) {
			const user = await userType.findOne({ _id, tokens: token })
			if (user) {
				req.user = user, req.token = token
				next();
			} else {
				throw new Error('No user found!')

			}
		} else {
			throw new Error('Invalid User Type!')
		}

	} catch (error) {
		res.status(401).send({ code: 401, message: 'Invalid token!' })
	}

};

module.exports = auth;
