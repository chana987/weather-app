const express = require("express")
const path = require("path")
const app = express()
const api = require("./server/routes/api")
const port = 3000
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/weatherDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})

app.use(express.static(path.join(__dirname, "dist")))
app.use(express.static(path.join(__dirname, "node_modules")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", api)

app.listen(process.env.PORT || port, () => console.log(`Running server on port ${port}`))
