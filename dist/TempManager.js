class TempManager {
    constructor() {
        this.cityData = []
    }

    async getDataFromDB() {
        const data = await $.get('/cities')
        if (data.length > 0) {
            data.forEach(c => {
                c.saved = true
                c.updatedAt = moment(c.updatedAt).format('ddd, HH:mm')
                c.temp = Math.round(c.temp)
            })
            this.cityData = data
            return true
        } else {
            return false
        }
    }

    async getCityData(cityName) {
        try {
            let data = await $.get(`/city/${cityName}`)
            if (data.error) {
                throw new Error("We can't seem to find that city")
            } else {
                let city = { ...data }
                city.updatedAt = moment(city.updatedAt).format('ddd, HH:mm')
                city.temp = Math.round(city.temp)
                this.cityData.push(city)
            }
        } catch(err) {
            console.log(err)
            return err
        }  
    }

    async saveCity(cityName) {
        let cityIndex = this.cityData.findIndex(c => c.name === cityName)
        try {
            await $.post('/city', this.cityData[cityIndex])
            if (data.err) {
                throw new Error("Already saved")
            }
            this.cityData[cityIndex].saved = true
        } catch(err) {
            console.log(err)
            return err
        }
    }

    removeCity(cityName) {
        let cityIndex = this.cityData.findIndex(c => c.name === cityName)
        this.cityData.splice(cityIndex, 1)
        $.ajax({
            method: 'delete',
            url: '/city',
            data: { city: cityName },
            success: () => console.log(`Removed ${cityName}`),
            error: (err) => {
                console.log(err)
                return err
            }
        })
    }

    updateCity(cityName) {
        let cityIndex = this.cityData.findIndex(c => c.name === cityName)
        $.ajax({
            method: 'put',
            url: '/city',
            data: { cityName: cityName },
            success: (data) => Object.assign(this.cityData[cityIndex], data),
            error: (err) => {
                console.log(err)
                return err
            }
        })
    }
}

