var express = require("express");
var adminRouter = require("./router/admin");
<<<<<<< HEAD
=======
var commonRouter = require("./router/common");
>>>>>>> origin/backend
var cors = require("cors");
require("./database/mongoose");
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
<<<<<<< HEAD
app.use(adminRouter);
=======

app.use(adminRouter);
app.use(commonRouter);
>>>>>>> origin/backend
app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
