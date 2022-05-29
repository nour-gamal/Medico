const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { getSelectedProperties } = require('../helpers/helpers')

const adminSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	avatar: {
		type: String,
	},
	role: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' },
	tokens: { type: Array },
	isActive: {
		type: Boolean,
		default: false
	}
}, { _id: false });

adminSchema.methods.generateJWTToken = async function () {
	const user = this;
	const expirationInSeconds = 60 * 60 * 24; //1 day
	const token = jwt.sign({ _id: user._id.toString(), userType: 1, role: user.role._id.toString(), isActive: user.isActive }, "SecretForMedico", {
		expiresIn: expirationInSeconds,
	});

	user.tokens.push(token);
	await user.save();
	return token;
};



adminSchema.statics.adminSignin = async function (_id) {
	try {
		var admin = await Admin.findOne({ _id: _id.toString() }).populate('role');
		if (!admin) {
			throw new Error()
		}

		const token = await admin.generateJWTToken();
		const adminResponse = getSelectedProperties(admin, ['tokens', 'role'], { token, role: admin.role._id });
		return adminResponse;
	} catch (error) {
		res.status(400).send({ code: 400, message: 'Invalid login attempt!' })
	}
}



const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
