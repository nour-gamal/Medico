const express = require("express");
const Admin = require("../models/Admin");
const auth = require("../middlewares/auth");
const adminRouter = new express.Router();

adminRouter.post("/admin/add", auth, async (req, res) => {
	const newAdmin = new Admin(req.body);
	try {
		await newAdmin.save();
		const token = await newAdmin.generateJWTToken();
		res
			.status(201)
			.send({
				code: 201,
				message: "Admin added successfully!",
				data: newAdmin,
			});
	} catch (error) {
		res.status(400).send({ code: 400, message: error.message });
	}
});

module.exports = adminRouter;
