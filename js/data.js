$(window).load(function () {
    $("#title").css("visibility", "visible");
    putDataOnSelect(genres, 'genreSelector');
    putDataOnSelect(directors, 'directorSelector');
    putDataOnSelect(actors, 'actorSelector');
    setMaxsAndMinsOnSliders();
    updateOutput();
});

// All data
var data = [];
// Filtered data
var actualInfo = [];
// All genres
var genres = [];
// All directors
var directors = [];
// All actors
var actors = [];
// Oldest year present in data
var minYear = Number.MAX_VALUE;
// Newest year present in data
var maxYear = Number.MIN_VALUE;
// Shortest film
var minRuntime = Number.MAX_VALUE;
// Longest film
var maxRuntime = Number.MIN_VALUE;
// Lowest rating
var minRating = Number.MAX_VALUE;
// Highest rating
var maxRating = Number.MIN_VALUE;

/**
 * Load CSV file
 * @returns {*|{}}
 */
function loadData() {
    return $.get('data/IMDB-Movie-Data.csv', function (data) {
        Papa.parse(data, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                parseData(results.data)
            }
        });
    });
}

// Finish loading
loadData().done();
$("#actorSelector").show();

/**
 * Get data from CSV file
 * @param result
 */
function parseData(result) {
    for (var i in result) {
        var row = result[i];
        data.push(row);
        addActors(row.Actors);
        addDirector(row.Director);
        addGenres(row.Genre);
        setMinYear(row.Year);
        setMaxYear(row.Year);
        setMinRuntime(row["Runtime (Minutes)"]);
        setMaxRuntime(row["Runtime (Minutes)"]);
        setMinRating(row.Rating);
        setMaxRating(row.Rating);
    }
    actualInfo = data.slice();
}

/**
 * Add actors
 * @param newActors
 */
function addActors(newActors) {
    var splitter = newActors.split(",")
    for (var i in splitter) {
        var actor = splitter[i].trim();
        if (actors.indexOf(actor) == -1)
            actors.push(actor);
    }
}

/**
 * Add director
 * @param newDirector
 */
function addDirector(newDirector) {
    if (directors.indexOf(newDirector) == -1)
        directors.push(newDirector);
}

/**
 * Add genres
 * @param newGenres
 */
function addGenres(newGenres) {
    var splitter = newGenres.split(",")
    for (var i in splitter) {
        var genre = splitter[i].trim();
        if (genres.indexOf(genre) == -1)
            genres.push(genre);
    }
}

/**
 * Set oldest year
 * @param year
 */
function setMinYear(year) {
    if (year < minYear)
        minYear = year;
}

/**
 * Set newest year
 * @param year
 */
function setMaxYear(year) {
    if (year > maxYear)
        maxYear = year;
}

/**
 * Ser shortest film
 * @param runtime
 */
function setMinRuntime(runtime) {
    if (runtime < minRuntime)
        minRuntime = runtime;
}

/**
 * Set longest film
 * @param runtime
 */
function setMaxRuntime(runtime) {
    if (runtime > maxRuntime)
        maxRuntime = runtime;
}

/**
 * Set worst film's classification
 * @param rating
 */
function setMinRating(rating) {
    if (rating < minRating)
        minRating = rating;
}

/**
 * Set better film's classification
 * @param rating
 */
function setMaxRating(rating) {
    if (rating > maxRating)
        maxRating = rating;
}

/**
 * Insert options in select
 * @param collection
 * @param id
 */
function putDataOnSelect(collection, id) {
    var selectBox = document.getElementById(id);
    collection.sort()
    for (var i in collection) {
        selectBox.options.add(new Option(collection[i], collection[i], false));
    }
}

/**
 * Insert maximums and minimums on range sliders
 */
function setMaxsAndMinsOnSliders() {
    $("#minYear").val(minYear);
    $("#maxYear").val(maxYear);
    $("#minYear").slider("refresh");
    $("#maxYear").slider("refresh");
    $("#minRuntime").val(minRuntime);
    $("#maxRuntime").val(maxRuntime);
    $("#minRuntime").slider("refresh");
    $("#maxRuntime").slider("refresh");
    $("#minRate").val(minRating);
    $("#maxRate").val(maxRating);
    $("#minRate").slider("refresh");
    $("#maxRate").slider("refresh");
}

function updateOutput() {
    $("#output").empty();
    $("#output").append("<p>" + JSON.stringify(actualInfo) + "</p>");
}

/**
 * Reset results on search
 */
function resetSearch() {
    document.getElementById('searchFilterForm').reset();
    setMaxsAndMinsOnSliders();
    //filterSearch()
}

function filterSearch() {
    var newGenres = getNewGenre($("#genreSelector").val());
    var newLatitudes = getNewLatitude($("#latitude").val());
    var newLongitude = getNewLongitude($("#longitude").val());
    var newWeight = getNewWeight($("#minWeight").val(), $("#maxWeight").val());
    var newSpeed = getNewSpeed($("#minSpeed").val(), $("#maxSpeed").val());
    actualInfo = [];

    for (var i in data) {
        if (newGenres.indexOf(data[i]) != -1
            && newLatitudes.indexOf(data[i]) != -1 && newLongitude.indexOf(data[i]) != -1
            && newWeight.indexOf(data[i]) != -1 && newSpeed.indexOf(data[i]) != -1) {
            actualInfo.push(data[i]);
        }
    }
}

function getNewGenre(newGenre) {
    if (newGenre == 'all')
        return data;
    else
        return data.filter(function (row) {
            return row.Genre == newGenre;
        });
}

function getNewLatitude(newLatitude) {
    if (newLatitude.trim().length == 0)
        return data;
    else
        return data.filter(function (row) {
            return row.latitude == newLatitude;
        });
}

function getNewLongitude(newLongitude) {
    if (newLongitude.trim().length == 0)
        return data;
    else
        return data.filter(function (row) {
            return row.longitude == newLongitude;
        });
}

function getNewWeight(newMinWeight, newMaxWeight) {
    return data.filter(function (row) {
        return row.weight >= newMinWeight && row.weight <= newMaxWeight;
    });
}

function getNewSpeed(newMinSpeed, newSpeed) {
    return data.filter(function (row) {
        return row.speed >= newMinSpeed && row.speed <= newSpeed;
    });
}

function returnToIndex() {
    window.history.back();
}

