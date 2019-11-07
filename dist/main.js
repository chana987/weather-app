const tempManager = new TempManager
const renderer = new Renderer

const loadPage = async function() {
    try {
        await tempManager.getDataFromDB()
        if (false) {
            throw new Error("empty")
        } else {
            renderer.renderData(tempManager.cityData)
        }
    }
    catch(err) {
        console.log(err)
    }
}

const handleSearch = async function(cityName) {
    await tempManager.getCityData(cityName)
    renderer.renderData(tempManager.cityData)
}

const changeCityStatus = async function(func) {
    let cityName = $(this).closest(".city").find(".city_name").text()
    await tempManager.func(cityName)
    renderer.renderData(tempManager.cityData)
}

$(".find-city").on("click", function() {
    let cityName = $(".city-input").val()
    $(".city-input").val("")
    handleSearch(cityName)
})

$(".cities").on("click", ".save-city", async function() {
    changeCityStatus(saveCity)
})

$(".cities").on("click", ".remove-city", function() {
    changeCityStatus(removeCity)
})

$(".cities").on("click", ".update-city", function() {
    changeCityStatus(updateCity)
})

loadPage()