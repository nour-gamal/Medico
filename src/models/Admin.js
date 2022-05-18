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
	role: { type: String, required: true },
	tokens: { type: Array },
});

adminSchema.methods.generateJWTToken = async function () {
	const user = this;
	const expirationInSeconds = 60 * 60 * 24; //1 day
	const token = jwt.sign({ _id: user._id.toString() }, "SecretForMedico", {
		expiresIn: expirationInSeconds,
	});

	user.tokens.push(token);
	await user.save();
	return token;
};

adminSchema.statics.adminSignup = async function (body) {
	const newAdmin = new Admin(body);
	try {
		const admin = await newAdmin.save();
		return 1;
	} catch (error) {
<<<<<<< HEAD
		throw new Error()
=======
		return error
>>>>>>> origin/backend
	}
}

adminSchema.statics.adminSignin = async function (email, password) {
	try {
		const admin = await Admin.findOne({ email })
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
		const adminResponse = getSelectedProperties(admin, ['password', 'tokens'], { token })
		return adminResponse;
<<<<<<< HEAD

=======
>>>>>>> origin/backend
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
