const express = require("express");
const commonRouter = new express.Router();
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const { getSelectedProperties, sendEmail } = require('../helpers/helpers');
const multer = require('multer');





commonRouter.post('/signup', async (req, res) => {
    const randomNumber = Math.floor(Math.random()) * 999999
    const newUser = new User({ ...req.body, verficationCode: randomNumber });
    try {
        const savedUser = await newUser.save();
        let body = { ...req.body, _id: savedUser.id }
        delete body.email
        delete body.password
        const userType = req.body.userType;
        const email = req.body.email
        switch (userType) {
            case 1:
                const newAdmin = new Admin(body);
                await newAdmin.save();
                break;
            case 2:
                const newDoctor = new Doctor(body);
                await newDoctor.save();
                break;
            default:
                throw new Error("Invalid user type!")
                break;
        }
        const LIVE_URL = process.env.LIVE_URL;
        const userTypeName = userType === 1 ? 'Admin' : userType === 2 ? 'Doctor' : 'Patient'
        sendEmail('Confirm Email', `<div>To Verify Please <a href=${LIVE_URL}/confirmEmail?code=${randomNumber}&email=${email}>Click Here</a></div>`, email)
        res
            .status(201)
            .send({
                code: 201,
                message: `${userTypeName} successfully Registered!`,
            });
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})
commonRouter.get('/confirmEmail', async (req, res) => {
    const { code, email } = req.query
    try {
        // const user = await User.exists()
        // if (!user) {
        //     throw new Error('Verification Faild!')
        // }
        await User.findOneAndUpdate({ email, verficationCode: code }, { isActive: true })
        res.redirect('https://www.google.com');
    } catch (error) {
        res.status(400).send({
            code: 400,
            message: error.message
        })
    }

})

commonRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new Error('Please fill all the fields!')
    }
    const isValidParams = !email || !password;
    var user = null
    var userData = null
    try {
        if (isValidParams) {
            throw new Error()
        }
        const user = await User.find({ email });
        const hashedPassword = user[0].password;
        if (!user) {
            throw new Error("Invalid Login Attempt!")
        }
        const isMatch = await bcrypt.compare(password, hashedPassword)
        if (!isMatch) {
            throw new Error("Invalid Login Attempt!")
        }


        if (!user[0].isActive) {
            throw new Error("Your account is not activated!")
        }

        switch (user[0].userType) {
            case 1:
                userData = await Admin.adminSignin(user[0]._id)
                break;
            case 2:
                userData = await Doctor.doctorSignin(user[0]._id)
                break;
            default:
                throw new Error()
        }

        res.status(200).send({ code: 200, data: userData })
    } catch (error) {
        res.status(400).send({
            code: 400, message: error.message
        })
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.query.fileType == 1) { //Type 1 equal Avatar
            cb(null, "./src/Public/Avatar")
        } else if (req.query.fileType == 2) {
            cb(null, "./src/Public/Documents")//type 2 equal Documents
        } else {
            return cb(new Error("Invalid file Type!"))
        }
    }, filename: (req, file, cb) => {
        cb(null, + Date.now() + file.originalname)
    }, limits: {
        fileSize: 1024 * 1024 * 5 //5 MB limit
    },
    fileFilter: (req, file, cb) => {
        if (req.query.fileType == 1) { //Type 1 equal Avatar
            if (file.mimetype.includes("image")) {
                cb(null, Date.now() + file.originalname);
            } else {
                return cb(new Error('Invalid mime type'));
            }
        } else if (req.query.fileType == 2) {
            cb(null, Date.now() + file.originalname);
        } else { }
    }
})

const uploadFile = multer({ storage })
commonRouter.post('/uploadSingleFile', uploadFile.single('file'), async (req, res) => {
    try {
        res.status(200).send({ code: 200, data: { message: 'File uploaded successfully!', path: req.file.path } })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

commonRouter.post('/uploadMultiFiles', uploadFile.array('file'), async (req, res) => {
    try {
        let pathArr = []
        req.files.forEach(file => {
            pathArr.push(file.path)
        })
        res.status(200).send({ code: 200, data: { message: 'File uploaded successfully!', paths: pathArr } })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

module.exports = commonRouter;