const express = require("express");
const Admin = require("../models/Admin");
const adminRouter = new express.Router();

adminRouter.post("/admin/add", async (req, res) => {
	const newAdmin = new Admin(req.body);
	try {
		await newAdmin.save();
		res
			.status(201)
			.send({
				code: 201,
				message: "Admin added successfully!",
			});
	} catch (error) {
		res.status(400).send({ code: 400, message: error.message });
	}
});



module.exports = adminRouter;
