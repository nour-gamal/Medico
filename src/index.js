var express = require("express");
var userRouter = require("./router/user");
var cors = require("cors");
require("./database/mongoose");
const PORT = process.env.PORT;
const app = express();
app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
app.use(express.json());
app.use(cors());

app.use(userRouter);
