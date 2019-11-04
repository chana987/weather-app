const express = require('express')
const router = express.Router()

const City = require('../models/City')

router.get('/city', function (req, res) {
    City.find({}, function (err, city) {
        res.send(city)
    })
})

module.exports = router
