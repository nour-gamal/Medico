const express = require("express");
const commonRouter = new express.Router()
const auth = require("../middlewares/auth");



commonRouter.post('/signin', async (req, res) => {
    console.log(req.user)
})

module.exports = commonRouter;