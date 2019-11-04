const tempManager = new TempManager
const renderer = new Renderer

const loadPage = async function() {
    await tempManager.getDataFromDB()
    renderer.renderData(tempManager.cityData)
}
loadPage()

const handleSearch = async function(cityName) {
    await tempManager.getCityData(cityName)
    renderer.renderData(tempManager.cityData)
}

$(".find-city").on("click", function() {
    let cityName = $(".city-input").val()
    $(".city-input").val("")
    handleSearch(cityName)
})

$(".cities").on("click", ".save-city", function() {
    let cityName = $(this).siblings(".city_name").text()
    tempManager.saveCity(cityName)
})

$(".cities").on("click", ".remove-city", function() {
    let cityName = $(this).siblings(".city_name").text()
    tempManager.removeCity(cityName)
})
