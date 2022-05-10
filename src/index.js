var express = require("express");
var userRouter = require("./router/user");
var cors = require("cors");
require("./database/mongoose");
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.use(userRouter);
