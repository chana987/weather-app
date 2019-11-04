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
    } catch {
        throw new Error("We can't seem to find this city, please check spelling")
    }
})

router.get('/cities', function (req, res) {
    City.find({})
    .exec(data => res.send(data))
})

router.post('/city', async function(req, res) {
    let city = new City({
        name: req.body.name,
        temperature: req.body.main.temp,
        condition: req.body.weather.main,
        conditionPic: req.body.weather.icon
    })
    city.save()
    .then( res.send(`${city.name} added to database`) )
})

router.delete('/city/:cityName', function(req, res) {
    try {
        City.findOneAndDelete({
            name: req.params.cityName
        })
        .then(res.send(`${req.params.cityName} removed from database`))
    } catch {
        res.send("This city is not saved")
    }
    
})

module.exports = router
