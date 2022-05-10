const express = require("express");
const User = require("../models/User");
const userRouter = new express.Router();

userRouter.post("/user/test", async (req, res) => {
	const data = {
		name: "nour",
		age: 23,
	};
	const userr = new User(data);
	try {
		await userr.save();
		res.status(201).send({ message: "saved" });
	} catch (err) {
		res.status(404).send({
			err: err.message,
		});
		console.log(err);
	}
});

module.exports = userRouter;
