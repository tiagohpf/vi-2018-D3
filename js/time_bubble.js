// Lowest value of runtime
var startRuntime = 0;
// Highest value of runtime
var finishRuntime = 0;
var ratings = {};
// Filtered information
var actualInfo = [];

function setData(data) {
    actualInfo = data.slice();
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
    createRatingsInstances();
}

function createRatingsInstances() {
    for (var i = startRuntime; i <= finishRuntime; i += 30)
        ratings[i] = [];
}