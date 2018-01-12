// Combinations of multiple genres
var genres_comb = {};
var genres_data = [];
var created = false;
var donut_chart;
var created = false;

/**
 * Count combinations of genres after filter search
 * @param data
 */

function countCombinations(data) {
    var sets = [];
    for (var i in data) {
        var genres = data[i].Genre.split(",");

        for (var j in genres){
            genre = genres[j];
            if (genres_comb[genre] != undefined)
                genres_comb[genre] += 1;
            else
                genres_comb[genre] = 1;
        }
    }

    console.log(genres_comb);
    for (var x in genres_comb) {
        sets.push({"Genre": x, size: genres_comb[x], label: x});
    }

    console.log(sets)
    createDonutChart(sets);
}

function createDonutChart(genres_comb) {
    if (created) {
        donutChart.svg.selectAll('*').remove();
    }
    var svg = dimple.newSvg("#vennContainer", 700, 600);
    donutChart = new dimple.chart(svg, genres_comb);
    donutChart.setBounds(20, 20, 460, 360)
    donutChart.addMeasureAxis("p", "size");
    var ring = donutChart.addSeries("Genre", dimple.plot.pie);
    ring.innerRadius = "50%";
    donutChart.addLegend(500, 20, 90, 300, "left");
    donutChart.draw();
    created = true
}
