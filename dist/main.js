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
    try {
        await tempManager.getCityData(cityName)
        renderer.renderData(tempManager.cityData)
    } catch(err) {
        return
    }
}

$(".find-city").on("click", function() {
    let cityName = $(".city-input").val()
    $(".city-input").val("")
    handleSearch(cityName)
})

$(".cities").on("click", ".save-city", async function() {
    let cityId = $(this).closest(".city").find(".city_name").data("id")
    try {
        await tempManager.saveCity(cityId)
    } catch(err) {
        console.log("whoops, that didn't work")
        return
    }
    renderer.renderData(tempManager.cityData)
})

$(".cities").on("click", ".remove-city", async function() {
    let cityId = $(this).closest(".city").find(".city_name").data("id")
    try {
        await tempManager.removeCity(cityId)
    } catch(err) {
        console.log("whoops, that didn't work")
        return
    }
    renderer.renderData(tempManager.cityData)
})

$(".cities").on("click", ".update-city", async function() {
    let cityId = $(this).closest(".city").find(".city_name").data("id")
    try {
        await tempManager.updateCity(cityId)
    } catch(err) {
        console.log("whoops, that didn't work")
        return
    }
    renderer.renderData(tempManager.cityData)
})

loadPage()