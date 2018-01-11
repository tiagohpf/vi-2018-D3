// Combinations of multiple genres
var genres_comb = {};
var genres_data = [];

/**
 * Count combinations of genres after filter search
 * @param data
 */
function countCombinations(data) {
    var sets = [];
    for (var i in data) {
        var genres = data[i].Genre;
        if (genres_comb[genres] != undefined)
            genres_comb[genres] += 1;
        else
            genres_comb[genres] = 1;
    }
    var i = 0;
    for (var x in genres_comb) {
        i++;
        sets.push({sets: x.split(','), size: genres_comb[x], label: x});
        if (i == 1)
            break;
    }
    sets = addMissedGenres(sets);
    createDiagram(sets);
}

function addMissedGenres(sets) {
    for (var i in genres) {
        if (genres_comb[genres[i]] == undefined) {
            sets.push({
                sets: genres[i],
                size: 0,
                label: genres[i]
            });
        }
    }
    return sets;
}

function createDiagram(newSets) {
    console.log(newSets);
    /*newSets = [
        {sets: ["Comedy"], size: 22},
        {sets: ["Family"], size: 133},
        {sets: ["Fantasy"], size: 21},
        {sets: ["Comedy", "Family"], size: 2},
        {sets: ["Family", "Fantasy"], size: 3},
        {sets: ["Fantasy", "Comedy"], size: 3},
        {sets: ["Comedy","Family","Fantasy"], size: 22},
        {sets: ["Sex"], size: 30},
        {sets: ["Comedy","Family","Fantasy", "Sex"], size: 22},
        ];*/
    //console.log(newSets[2]);
    var diagram = venn.VennDiagram().width(500).height(400);
    var chart = d3.select("#vennContainer").datum(newSets).call(diagram);
}
