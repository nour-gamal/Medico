const express = require("express");
const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;
mongoose
	.connect(MONGODB_URL)
	.then(() => {})
	.catch((error) => console.log(`${error} did not connect`));
