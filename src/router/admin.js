const express = require("express");
const Admin = require("../models/Admin");
const { getSelectedProperties } = require('../helpers/helpers')
const adminRouter = new express.Router();

adminRouter.post("/admin/add", async (req, res) => {
	const newAdmin = new Admin(req.body);
	try {
		await newAdmin.save();
		// const token = await newAdmin.generateJWTToken();
		const savedAdmin = getSelectedProperties(newAdmin, ['password', 'tokens'])

		res
			.status(201)
			.send({
				code: 201,
				message: "Admin added successfully!",
				data: savedAdmin,
			});
	} catch (error) {
		res.status(400).send({ code: 400, message: error.message });
	}
});

adminRouter.post('/admin/login', async (req, res) => { })


module.exports = adminRouter;
