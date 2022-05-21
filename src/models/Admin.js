const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { getSelectedProperties } = require('../helpers/helpers')

const adminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Please enter a valid email!");
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
			if (!validator.isStrongPassword(value)) {
				throw new Error("Please enter a strong password!");
			}
		},
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
});

adminSchema.methods.generateJWTToken = async function () {
	const user = this;
	const expirationInSeconds = 60 * 60 * 24; //1 day
	const token = jwt.sign({ _id: user._id.toString(), userType: 1 }, "SecretForMedico", {
		expiresIn: expirationInSeconds,
	});

	user.tokens.push(token);
	await user.save();
	return token;
};

adminSchema.statics.adminSignup = async function (body) {
	const newAdmin = new Admin(body);
	try {
		await newAdmin.save();
	} catch (error) {
		throw new Error(error.message)
	}
}

adminSchema.statics.adminSignin = async function (email, password) {
	try {
		var admin = await Admin.findOne({ email }).populate('role')
		if (!admin) {
			throw new Error()
		}
		const hashedPassword = admin.password;
		bcrypt.compare(password, hashedPassword, (err, res) => {
			if (!res) {
				throw new Error()
			}
		});
		const token = await admin.generateJWTToken();
		const adminResponse = getSelectedProperties(admin, ['password', 'tokens', 'role'], { token, role: admin.role.name })
		return adminResponse;

	} catch (error) {
		res.status(400).send({ code: 400, message: 'Invalid login attempt!' })
	}
}


adminSchema.pre('save', async function (next) {
	const admin = this;
	if (admin.isModified('password')) {
		admin.password = await bcrypt.hash(admin.password, 8)
	}
	next();
})

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
