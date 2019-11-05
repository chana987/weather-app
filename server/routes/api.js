const express = require('express')
const router = express.Router()
const requestPromise = require('request-promise')
const config = require('../config.js')
const weatherApiKey = config.WEATHER_KEY

const City = require('../models/City')

router.get('/sanity', function(req, res) {
    console.log("everything's fine")
    res.send("everything's fine")
})

router.get('/city/:cityName', async function (req, res) {
    let data = await requestPromise(`http://api.openweathermap.org/data/2.5/find?q=${req.params.cityName}&units=metric&APPID=d7af858ceec5dc3e62029c5cb42dc419`)
    let cityData = JSON.parse(data).list[0]
    try {
        if (cityData) {
            let city = { 
                id: cityData.id,
                name: cityData.name,
                temp: cityData.main.temp,
                country: cityData.sys.country,
                condition: cityData.weather[0].main,
                icon: cityData.weather[0].icon
            }
            res.send(city)
        } else {
            throw new Error("We can't seem to find this city, please check spelling")
        }
    } catch(e) {
        res.send(e)
    }
})

router.get('/cities', function (req, res) {
    City.find({})
    .then(data => res.send(data))
})

router.post('/city', async function(req, res) {
    try {
        if (req.body.name) {
            let city = new City( req.body )
            city.save()
            .then( res.send(`${city.name} added to database`) )
        } else {
            throw new Error("didn't work")
        }
    } catch(e) {
        res.send(e)
    }
    
})

router.delete('/city', function(req, res) {
    City.findOneAndDelete({
        name: req.body.city
    })
    .then(res.end())
    // try {
        
    //     // throw new Error("This city is not saved")
    // } catch(e) {
    //     res.send(e)
    // }  
})

module.exports = router
