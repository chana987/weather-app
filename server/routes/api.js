const express = require('express')
const router = express.Router()
const requestPromise = require('request-promise')
const config = require('../config.js')
const weatherApiKey = config.WEATHER_KEY

const City = require('../models/City')

router.get('/city/:cityName', async function (req, res) {
    let data = await requestPromise(`http://api.openweathermap.org/data/2.5/find?q=${req.params.cityName}&units=metric&APPID=${weatherApiKey}`)
    try {
        res.send(JSON.parse(data).list)
        throw new Error("We can't seem to find this city, please check spelling")
    } catch(e) {
        console.log(e)
    }
})

router.get('/cities', function (req, res) {
    City.find({})
    .then(data => res.send(data))
})

router.post('/city', async function(req, res) {
    let city = new City({ ...req.body })
    city.save()
    .then( res.send(`${city.name} added to database`) )
})

router.delete('/city/:cityId', function(req, res) {
    try {
        City.findOneAndDelete({
            name: req.params.name
        })
        .then(res.send(`${req.params.cityName} removed from database`))
        throw new Error("This city is not saved")
    } catch(e) {
        console.log(e)
    }
    
})

module.exports = router
