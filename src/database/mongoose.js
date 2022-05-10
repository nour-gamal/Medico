const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;
mongoose
	.connect(MONGODB_URL)
	.then(() =>
		app.listen(process.env.PORT, () =>
			console.log(`Server Running on Port: ${PORT}`)
		)
	)
	.catch((error) => console.log(`${error} did not connect`));
