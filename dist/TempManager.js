class TempManager {
	constructor() {
		this.cityData = []
	}

	getCities() {
		return this.cityData
	}

	async getDataFromDB() {
		const data = await $.get("/cities")
		if (data.length > 0) {
			data.forEach(c => {
				c.saved = true
				c.formattedTime = moment(c.updatedAt).format("ddd, HH:mm")
				c.temp = Math.round(c.temp)
			})
			this.cityData = data
			return true
		} else {
			return false
		}
	}

	async getCityData(city) {
		city = city
            .toLowerCase()
            .replace(',', '')
            .split(" ")
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        	.join(" ")
        try {
			let data = await $.get(`/city/${city}`)
			if (data.temp) {
				let city = { ...data }
				city.formattedTime = moment(city.updatedAt).format("ddd, HH:mm")
				city.temp = Math.round(city.temp)
				this.cityData.push(city)
			} else {
				throw new Error("We can't seem to find that city")
			}
		} catch (err) {
			$(".message").append(`<p>whoops, that city doesn't exist</p>`)
			setTimeout(function () {
				$(".message").empty()
			}, 2500)
			return err
		}
	}

	async saveCity(cityId) {
		let city = this.cityData.find(c => c.id == cityId)
        try {
			await $.post("/city", city, () => {})
			city.saved = true
            if (err) {
				throw new Error("Already saved")
			} 
		} catch (err) {
			return err
		}
	}

	removeCity(cityId) {
        let cityIndex = this.cityData.findIndex(c => c.id === cityId)
		this.cityData.splice(cityIndex, 1)
		$.ajax({
			method: "delete",
			url: "/city",
			data: { id: cityId },
			success: () => console.log(`Removed`),
			error: err => {
				return err
			}
		})
	}

	async updateCity(cityId) {
		let city = this.cityData.find(c => c.id === cityId)
		console.log('updating ' + city.name)
		if (city.saved) {
			$.ajax({
				method: "put",
				url: "/city",
				data: { id: cityId },
				success: res => {
					Object.assign(city, res)
					city.formattedTime = moment(city.updatedAt).format("ddd, HH:mm")
				},
				error: err => {
					return err
				}
			})
		} else {
			let data = await $.get(`/city/${city}`)
			Object.assign(city, data)
		}
	}

	keepUpdated() {
		console.log('3')
		for (let city of this.cityData) {
			this.updateCity(city.cityId)
		}
	}
}
