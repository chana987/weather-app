const express = require('express')
const router = express.Router()
const requestPromise = require('request-promise')
const xml2js = require('xml2js')
var parser = new xml2js.Parser
const moment = require('moment')
const config = require('../config.js')
const weatherApiKey = config.WEATHER_KEY || API_KEY

const City = require('../models/City')

router.get('/sanity', function(req, res) {
    res.send("everything's fine")
})

router.get('/city/:cityName', function (req, res) {
    requestPromise(`http://api.openweathermap.org/data/2.5/find?q=${req.params.cityName}&units=metric&mode=xml&APPID=${weatherApiKey}`)
    .then(data => {
        let cityData
        parser.parseStringPromise(data)
        .then(result => {
            cityData = result.cities.list[0].item[0]

            let city = { 
                id: cityData.city[0].$.id,
                name: cityData.city[0].$.name,
                country: cityData.city[0].country[0],
                temp: cityData.temperature[0].$.value,
                condition: cityData.weather[0].$.value,
                icon: cityData.weather[0].$.icon,
                updatedAt: cityData.lastupdate[0].$.value
            }
            res.send(city)
        })
        .catch(err => console.log(err))
    })
    .catch(err => {
        let error = { ...err, body: "We can't seem to find this city"}
        res.send(error)
    })
})

router.get('/cities', function (req, res) {
    City.find({})
    .then(data => {
        data.updatedAt = moment(data.updatedAt).format()
        res.send(data)
    })
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

router.put('/city', function(req, res) {
    requestPromise(`http://api.openweathermap.org/data/2.5/find?q=${req.body.cityName}&units=metric&mode=xml&APPID=${weatherApiKey}`)
    .then(data => {
        parser.parseStringPromise(data)
        .then(result => {
            let temp = result.cities.list[0].item[0].temperature[0].$.value
            let condition = result.cities.list[0].item[0].weather[0].$.value
            let updatedAt = result.cities.list[0].item[0].lastupdate[0].$.value

            City.findOneAndUpdate({
                "name": req.body.city
            },
            {
                $set: { "temp": temp, "condition": condition, "updatedAt": updatedAt } 
            })
            .exec(city => res.send(city))
        })
    })
    .catch(err => console.log(err.message))
})
    

module.exports = router
