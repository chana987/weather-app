class TempManager {
    constructor() {
        this.cityData = []
    }

    async getDataFromDB() {
        const data = await $.get('/cities')
        data.forEach(c => {
            c.saved = true
            c.updatedAt = `Last updated: ${moment(c.updatedAt).format('ddd, HH:mm')}`
        })
        this.cityData = data
    }

    async getCityData(cityName) {
        try {
            let data = await $.get(`/city/${cityName}`)
            let city = { ...data }
            this.cityData.push(city)
        } catch(e) {
            console.log(e.message)
        }  
    }

    async saveCity(cityName) {
        let cityIndex = this.cityData.findIndex(c => c.name === cityName)
        try {
            await $.post('/city', this.cityData[cityIndex])
            this.cityData[cityIndex].saved = true
        } catch(e) {
            console.log(e)
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
            error: (e) => console.log(e)
        })
    }

    updateCity(cityName) {
        let cityIndex = this.cityData.findIndex(c => c.name === cityName)
        let isSaved = this.cityData[cityIndex].saved
        $.ajax({
            method: 'put',
            url: '/city',
            data: { cityName: cityName },
            success: (data) => Object.assign(this.cityData[cityIndex], data),
            error: (e) => console.log(e)
        })
    }
}

