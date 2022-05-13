const express = require("express");
const Admin = require("../models/Admin");
<<<<<<< HEAD
const auth = require("../middlewares/auth");
const adminRouter = new express.Router();

adminRouter.post("/admin/add", auth, async (req, res) => {
	const newAdmin = new Admin(req.body);
	try {
		await newAdmin.save();
		const token = await newAdmin.generateJWTToken();
=======
const { getSelectedProperties } = require('../helpers/helpers')
const adminRouter = new express.Router();

adminRouter.post("/admin/add", async (req, res) => {
	const newAdmin = new Admin(req.body);
	try {
		await newAdmin.save();
		// const token = await newAdmin.generateJWTToken();
		const savedAdmin = getSelectedProperties(newAdmin, ['password', 'tokens'])

>>>>>>> origin/backend
		res
			.status(201)
			.send({
				code: 201,
				message: "Admin added successfully!",
<<<<<<< HEAD
				data: newAdmin,
=======
				data: savedAdmin,
>>>>>>> origin/backend
			});
	} catch (error) {
		res.status(400).send({ code: 400, message: error.message });
	}
});

<<<<<<< HEAD
=======
adminRouter.post('/admin/login', async (req, res) => { })


>>>>>>> origin/backend
module.exports = adminRouter;
