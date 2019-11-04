class TempManager {
    constructor() {
        this.cityData = []
    }

    async getDataFromDB() {
        const data = await $.get('/cities')
        this.cityData = data
    }

    async getCityData(cityName) {
        let data = await $.get(`/city/${cityName}`)
        try {
            if (data instanceof Error) {
                throw new Error(e)
            } else {
                let city = { ...data }
                this.cityData.push(city)
            }
        } catch(e) {
            console.log(e)
        }  
    }

    saveCity(cityName) {
        let city = this.cityData.find(c => c.name === cityName)
        $.post('/city', city, () => console.log(`Saved ${cityName}`))
    }

    removeCity(cityName) {
        $.ajax({
            method: 'delete',
            url: '/city',
            data: { city: cityName },
            success: () => console.log(`Removed ${cityName}`),
            error: (e) => console.log(e)
        })
    }
}

