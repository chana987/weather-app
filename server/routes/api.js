const express = require('express')
const router = express.Router()
const requestPromise = require('request-promise')
const xml2js = require('xml2js')
var parser = new xml2js.Parser

const City = require('../models/City')

router.get('/city/:cityName/:country', function (req, res) {
    requestPromise(`http://api.openweathermap.org/data/2.5/find?q=${req.body.cityName}&units=metric&mode=xml&APPID=d7af858ceec5dc3e62029c5cb42dc419`)
    .then(data => {
        parser.parseStringPromise(data)
        .then(result => {
            let cityData = result.cities.list[0].item[0]

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
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
})

router.get('/cities', function (req, res) {
    City.find({})
    .then(data => res.send(data))
    // .catch(err => {
    //     console.log(err)
    //     res.send(err)
    // })
})

router.post('/city', function(req, res) {
    let city = new City({ ...req.body })
    city.save()
    .then( res.send({ success: `${city.name} added to database` }))
    .catch(err => {
        console.log(err)
        res.send(err)
    })
})

router.delete('/city', function(req, res) {
    City.findOneAndDelete({
        name: req.body.city
    })
    .then(res.send({ success: `${city.name} removed from database` }))
    .catch(err => {
        console.log(err)
        res.send(err)
    })
})

router.put('/city', function(req, res) {
    requestPromise(`http://api.openweathermap.org/data/2.5/find?q=${req.body.cityName}&units=metric&mode=xml&APPID=d7af858ceec5dc3e62029c5cb42dc419`)
    .then(data => {
        parser.parseStringPromise(data)
        .then(result => {
            let cityData = result.cities.list[0].item[0]

            let temp = cityData.temperature[0].$.value
            let condition = cityData.weather[0].$.value
            let icon = cityData.weather[0].$.icon
            let updatedAt = cityData.lastupdate[0].$.value

            City.findOneAndUpdate({
                "name": req.body.city
            },
            {
                $set: { "temp": temp, "condition": condition, "icon": icon, "updatedAt": updatedAt } 
            })
            .exec(city => res.send(city))
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
})

module.exports = router

