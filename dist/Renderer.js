class Renderer {
    renderData(allCityData) {
        const source = $("#city-template").html()
        const template = Handlebars.compile(source)
        const newHTML = template({ allCityData })
        $(".cities").empty().append(newHTML)
    }
}