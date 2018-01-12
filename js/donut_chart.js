// Combinations of multiple genres
var genres_data = [];
var filteredInfo = [];
var genres_count = {};

function setData(data) {
    filteredInfo = data.slice();
}

/**
 * Count combinations of genres after filter search
 * @param data
 */
function countCombinations() {
    var sets = [];
    for (var i in filteredInfo) {
        var genres = filteredInfo[i].Genre.split(",");
        for (var j in genres) {
            var genre = genres[j].trim();
            if (genres_count[genre] != undefined)
                genres_count[genre] += 1;
            else
                genres_count[genre] = 1;
        }
    }
    for (var i in genres_count)
        sets.push({"Genre": i, Size: genres_count[i], label: i});
    createDonutChart(sets);
}

function createDonutChart(genres_comb) {
    var svg = dimple.newSvg("#pieContainer", 800, 600);
    donutChart = new dimple.chart(svg, genres_comb);
    donutChart.setBounds(175, 50, 460, 360);
    donutChart.addMeasureAxis("p", "Size");
    var ring = donutChart.addSeries("Genre", dimple.plot.pie);
    ring.innerRadius = "50%";
    donutChart.addLegend(675, 100, 90, 300, "left");
    donutChart.draw();
}
