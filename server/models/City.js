const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
    id: Number,
    name: { type: String, required: true },
    temp: Number,
    country: String,
    condition: String,
    icon: String
})

const City = mongoose.model("city", citySchema)
module.exports = City
