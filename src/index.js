var express = require("express");
var adminRouter = require("./router/admin");
var commonRouter = require("./router/common");
var genderRouter = require("./router/gender");
var cors = require("cors");
require("./database/mongoose");
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.use(adminRouter);
app.use(commonRouter);
app.use(genderRouter);
app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
