// Combinations of multiple genres
var genres_comb = {};

/**
 * Count combinations of genres after filter search
 * @param data
 */
function countCombinations(data) {
    var genres_comb = {};
    var sets = [];
    for (var i in data) {
        var genres = data[i].Genre;
        if (genres_comb[genres] != undefined)
            genres_comb[genres] += 1;
        else
            genres_comb[genres] = 1;
    }
    for (var x in genres_comb) {
        sets.push({sets: x.split(","), size: genres_comb[x]});
    }
    console.log(sets);
    createDiagram(sets);
}

function createDiagram(sets) {
    var sets = [ {sets: ['A'], size: 12},
        {sets: ['B'], size: 12},
        {sets: ['A','B'], size: 2}];


    console.log(sets)
    var chart = venn.VennDiagram()
    d3.select("#vennContainer").datum(sets).call(chart);
}
