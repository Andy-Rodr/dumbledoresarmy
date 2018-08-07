
var convertToCsv = function (header_string, twarray){
    result = header_string + '\n';
    for (var i = 0; i < twarray.length; i++){
        console.log(twarray[i]);
        csvline = '"';
        for (var j = 0; j < twarray[i].length; j++){
            console.log(twarray[i][j]);
            twone = twarray[i][j].replace('"', '""');
            twtwo = twone;//.replace(',', ' ');
            csvline += twtwo;
            if (j+1 != twarray[i].length){
                csvline += '","'
            }
        }
        csvline += '"\n';
        result += csvline;
    }
    return result;
}

exports.convertCsv = convertToCsv;