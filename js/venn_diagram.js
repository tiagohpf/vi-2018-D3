// Combinations of multiple genres
var genres_comb = {};

/**
 * Count combinations of genres after filter search
 * @param data
 */
function countCombinations(data) {
    genres_comb = {};
    for (var i in data) {
        var genres = data[i].Genre;
        if (genres_comb[genres] != undefined)
            genres_comb[genres] += 1;
        else
            genres_comb[genres] = 1;
    }
    console.log(genres_comb);
}