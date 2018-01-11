// Lowest value of runtime
var startRuntime;
// Highest value of runtime
var finishRuntime;
// Highest value of year
var highYear;
// Lowest value of year
var lowYear;
// Data of films filtered
var films_data = [];
// Filtered information
var filteredInfo = [];

function setData(data) {
    filteredInfo = data.slice();
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
    var filteredYear = getNewYear(year, year);
    var filteredRuntime = getNewRuntime(firstRange, lastRange);
    var filterFilms = intersect(filteredYear, filteredRuntime);
    if (filterFilms.length > 0) {
        var sum = 0;
        for (var i in filterFilms)
            sum += filterFilms[i].Rating;
        var meanRating = sum / filterFilms.length;
        films_data.push({
            'Year': parseInt(year),
            'Runtime': parseInt(lastRange),
            'Rating': parseFloat(meanRating.toFixed(1))
        });
    }
}