const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
=======
const bcrypt = require('bcryptjs')
>>>>>>> origin/backend
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
<<<<<<< HEAD
const Admin = mongoose.model("Admin", adminSchema);

=======


adminSchema.pre('save', async function (next) {
	const admin = this;
	if (admin.isModified('password')) {
		admin.password = await bcrypt.hash(admin.password, 8)
	}
	next();
})

const Admin = mongoose.model("Admin", adminSchema);
>>>>>>> origin/backend
module.exports = Admin;
