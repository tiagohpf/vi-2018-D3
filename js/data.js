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
// Id of diagram in use
var diagramInUse;

/**
 * Load CSV file
 * @returns {*|{}}
 */
$(document).ready(function() {
    $.ajax({
        type: 'get',
        url: 'data/IMDB-Movie-Data.csv',
        dataType: 'text',
        success: function(data) {
            Papa.parse(data, {
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    parseData(results.data)
                }
            });
            $("#title").css("visibility", "visible");
            putDataOnSelect(genres, 'genreSelector');
            putDataOnSelect(directors, 'directorSelector');
            putDataOnSelect(actors, 'actorSelector');
            setMaxsAndMinsOnSliders();
        }
    });
})

function changeCrumb(active) {
    if (active == 'vennCrumb') {
        $("#bubbleCrumb").removeClass("active");
        $("#vennCrumb").find('a').addClass("active");
        $("#chartContainer").empty();
        prepareVennDiagram();
        diagramInUse = 'venn';
    }
    else {
        $("#vennCrumb").removeClass("active");
        $("#bubbleCrumb").find('a').addClass("active");
        $("#vennContainer").empty();
        prepareBubbleChart();
        diagramInUse = 'bubble';
    }
}

function prepareBubbleChart() {
    $("#vennContainer").empty();
    movies_data = [];
    setData(actualInfo);
    setStartRuntime($("#minRuntime").val());
    setFinishRuntime($("#maxRuntime").val());
    setYears($("#minYear").val(), $("#maxYear").val());
    bubbleChart.svg.selectAll('*').remove();
    $("#chartContainer").empty();
    createBubbleChart();
}

function prepareVennDiagram() {
    $("#chartContainer").empty();
    countCombinations(actualInfo);
}

// Show actors
$("#actorSelector").show();

/**
 * Get data from CSV file
 * @param result
 */
function parseData(result) {
    for (var i in result) {
        var row = result[i];
        if (row.Rank != "" && row != undefined) {
            //console.log(row);
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
    setData(actualInfo);
    setStartRuntime($("#minRuntime").val());
    setFinishRuntime($("#maxRuntime").val());
    setYears($("#minYear").val(), $("#maxYear").val());
    createBubbleChart();
    prepareVennDiagram();
}

/**
 * Reset results on search
 */
function resetSearch() {
    document.getElementById('searchFilterForm').reset();
    setMaxsAndMinsOnSliders();
    filterSearch();
}

/**
 * Filter results after search
 */
function filterSearch() {
    var newGenre = getNewGenre($("#genreSelector").val());
    var newYear = getNewYear($("#minYear").val(), $("#maxYear").val());
    var newRuntime = getNewRuntime($("#minRuntime").val(), $("#maxRuntime").val());
    var newRating = getNewRating($("#minRate").val(), $("#maxRate").val());
    var newActor = getNewActor($("#actorSelector").val());
    var newDirector = getNewDirector($("#directorSelector").val());
    actualInfo = [];

    for (var i in data) {
        if (newGenre.indexOf(data[i]) != -1
            && newYear.indexOf(data[i]) != -1 && newRuntime.indexOf(data[i]) != -1
            && newRating.indexOf(data[i]) != -1 && newActor.indexOf(data[i]) != -1
            && newDirector.indexOf(data[i]) != -1) {
            actualInfo.push(data[i]);
        }
    }
    if (diagramInUse == 'venn')
        prepareVennDiagram();
    else
        prepareBubbleChart();
}

function getNewGenre(newGenre) {
    if (newGenre == 'all') {
        genres_comb = genres;
        return data;
    }
    else {
        var result = [];
        for (var i in data) {
            var splitter = data[i].Genre.split(",")
            for (var element in splitter) {
                var genre = splitter[element].trim();
                if (genre == newGenre) {
                    result.push(data[i]);
                    break;
                }
            }
        }
        return result;
    }
}

/**
 * Get data within year's range
 * @param newMinYear
 * @param newMaxYear
 * @returns {Array.<*>}
 */
function getNewYear(newMinYear, newMaxYear) {
    return data.filter(function (row) {
        return row.Year >= newMinYear && row.Year <= newMaxYear;
    });
}

/**
 * Get data within runtime's range
 * @param newMinRuntime
 * @param newMaxRuntime
 * @returns {Array.<*>}
 */
function getNewRuntime(newMinRuntime, newMaxRuntime) {
    return data.filter(function (row) {
        return row["Runtime (Minutes)"] >= newMinRuntime && row["Runtime (Minutes)"] <= newMaxRuntime;
    });
}

/**
 * Get data within rating's range
 * @param newMinRate
 * @param newMaxRate
 * @returns {Array.<*>}
 */
function getNewRating(newMinRate, newMaxRate) {
    return data.filter(function (row) {
        return row.Rating >= newMinRate && row.Rating <= newMaxRate;
    });
}

/**
 * Get data with certain actor
 * @param newActor
 * @returns {Array}
 */
function getNewActor(newActor) {
    if (newActor == 'all')
        return data;
    else {
        var result = [];
        for (var i in data) {
            var splitter = data[i].Actors.split(",")
            for (var actor in splitter) {
                if (splitter[actor].trim() == newActor) {
                    result.push(data[i]);
                    break;
                }
            }
        }
        return result;
    }
}

/**
 * Get data with certain director
 * @param newDirector
 * @returns {*}
 */
function getNewDirector(newDirector) {
    if (newDirector == 'all')
        return data;
    else {
        return data.filter(function (row) {
            return row.Director == newDirector;
        });
    }
}
