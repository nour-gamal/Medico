const express = require('express');
const Role = require('../models/Role');
const auth = require('../middlewares/auth');
const roleRouter = new express.Router()

roleRouter.post('/addRole', auth, async (req, res) => {
    const newRole = new Role(req.body);
    try {
        await newRole.save()
        res.status(201).send({ code: 201, message: 'Role added successfully' })
    } catch (error) {
        res.status(400).send({ code: 400, message: error.message })
    }
})

roleRouter.get('/getAllRoles', auth, async (req, res) => {
    try {
        const RolesList = await Role.find({});
        res.status(200).send({ code: 200, data: RolesList })
    } catch (error) {
        res.status(404).send({ code: 404, message: error.message })
    }
})

module.exports = roleRouter