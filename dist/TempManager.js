class TempManager {
    constructor() {
        this.cityData = []
    }

    async getDataFromDB() {
        const data = await $.get('/cities')
        this.cityData = data
    }

    async getCityData(cityName) {
        try {
            let data = await $.get(`/city/${cityName}`)
            let city = { ...data }
            this.cityData.push(city)
        } catch(e) {
            alert(e)
        }  
    }

    saveCity(cityName) {
        let city = this.cityData.find(c => c.name === cityName)
        $.post('/city', city, () => console.log(`Saved ${cityName}`))
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
        $.ajax({
            method: 'put',
            url: '/city',
            data: { cityName: cityName },
            success: (data) => this.cityData[cityIndex] = { ...data },
            error: (e) => console.log(e)
        })
    }
}

