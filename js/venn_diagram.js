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

        genres = genres.split(",")

        if(genres.length > 1){
            for (var j in genres){
                genre = genres[j];
                if (genres_comb[genre] != undefined)
                    genres_comb[genre] += 1;
                else
                    genres_comb[genre] = 1;
            }

             if(genres.length == 3){
                 genres = [genres[0]+","+genres[1],genres[0]+","+genres[2],genres[1]+","+genres[2]]
                 for (var k in genres){
                     genre = genres[k];
                     if (genres_comb[genre] != undefined)
                         genres_comb[genre] += 1;
                     else
                         genres_comb[genre] = 1;
                 }
             }
        }
    }

    console.log(genres_comb);

    for (var x in genres_comb) {
        sets.push({sets: x.split(','), size: genres_comb[x], label: x});
    }

    createDiagram(sets);
}

function createDiagram(sets) {
    var diagram = venn.VennDiagram().width(500).height(400);
    var chart = d3.select("#vennContainer").datum(sets).call(diagram);
}
