// Lowest value of runtime
var startRuntime;
// Highest value of runtime
var finishRuntime;
// Highest value of year
var highYear;
// Lowest value of year
var lowYear;
// Data of movies filtered
var movies_data = [];
// Filtered information
var filteredInfo = [];
var bubbleChart;

function setData(data) {
    filteredInfo = data.slice();
    //console.log(filteredInfo);
}

/**
 * Set first time's interval
 * @param time
 */
function setStartRuntime(time) {
    startRuntime = time;
    while (startRuntime % 30 != 0)
        startRuntime++;
}

/**
 * Set last time's interval
 * @param time
 */
function setFinishRuntime(time) {
    finishRuntime = time;
    if (finishRuntime != startRuntime) {
        while (finishRuntime % 30 != 0)
            finishRuntime++;
    }
}

/**
 * Define highest and lowest years
 * @param minYear
 * @param maxYear
 */
function setYears(minYear, maxYear) {
    lowYear = minYear;
    highYear = maxYear;
    for (var i = lowYear; i <= highYear; i++)
        createPeriodsInstances(i);
}

/**
 * Create ranges of time
 * @param year
 */
function createPeriodsInstances(year) {
    for (var i = startRuntime; i <= finishRuntime; i += 30) {
        if (i == startRuntime && startRuntime <= 30)
            calculateMeanRating(year, 0, i);
        else
            calculateMeanRating(year, (i - 30) + 1, i);
    }
}

/**
 * Intersection of two arrays
 * @param a
 * @param b
 * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
 */
function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

/**
 * Calculate mean rating of each range in each year
 * @param year
 * @param firstRange
 * @param lastRange
 */
function calculateMeanRating(year, firstRange, lastRange) {
    var filteredYear = filterYear(year);
    var filteredRuntime = filterRuntime(firstRange, lastRange);
    var filterFilms = intersect(filteredYear, filteredRuntime);
    //console.log("Filter: ", filteredRuntime);
    if (filterFilms.length > 0) {
        var sum = 0;
        for (var i in filterFilms)
            sum += filterFilms[i].Rating;
        var meanRating = sum / filterFilms.length;
        movies_data.push({
            'Year': parseInt(year),
            'Runtime': parseInt(lastRange),
            'Rating': parseFloat(meanRating.toFixed(2)),
        });
    }
}

/**
 * Filter data by year
 * @param year
 * @returns {Array.<*>}
 */
function filterYear(year) {
    return filteredInfo.filter(function (row) {
        return row.Year == year;
    });
}

/**
 * Filter data by runtime
 * @param minTime
 * @param maxTime
 * @returns {Array.<*>}
 */
function filterRuntime(minTime, maxTime) {
    return filteredInfo.filter(function (row) {
        return row["Runtime (Minutes)"] >= minTime && row["Runtime (Minutes)"] <= maxTime;
    });
}

/**
 * Draw Bubble Line chart
 */
function createBubbleChart() {
    var svg = dimple.newSvg("#chartContainer", 700, 600);
    bubbleChart = new dimple.chart(svg, movies_data);
    bubbleChart.setBounds(70, 40, 650, 450)

    var x = bubbleChart.addMeasureAxis("x", "Runtime");
    var y = bubbleChart.addCategoryAxis("y", "Rating");
    var z = bubbleChart.addAxis("z", "Rating");

    // Max and min of axis x
    x.overrideMin = startRuntime - 30;
    x.overrideMax = finishRuntime + 30;

    // Bubbles size
    z.overrideMin = 0;
    z.overrideMax = 20;

    // Add the bubble series for shift values first so that it is
    bubbleChart.addSeries("Year", dimple.plot.bubble);

    // Add the line series on top of the bubbles
    var s = bubbleChart.addSeries("Year", dimple.plot.line);

    // Add line markers to the line because it looks nice
    s.lineMarkers = true;

    // Show a legend
    bubbleChart.addLegend(180, 10, 360, 20, "right");

    // Draw everything
    bubbleChart.draw();
}
