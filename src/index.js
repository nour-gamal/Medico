const express = require("express");
const adminRouter = require("./router/admin");
const commonRouter = require("./router/common");
const genderRouter = require("./router/gender");
const doctorRouter = require('./router/doctor');
const roleRouter = require('./router/role');
const specialityRouter = require('./router/speciality');
require("./database/mongoose");
const cors = require("cors");


const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

//Routers
app.use(commonRouter);
app.use('/admin', adminRouter);
app.use('/role', roleRouter);
app.use('/doctor', doctorRouter);
app.use('/gender', genderRouter);
app.use('/speciality', specialityRouter);

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
