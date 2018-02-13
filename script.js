const request = require('request');

function bringApi(res){
    request('https://pokeapi.co/api/v2/pokemon/?limit=1000&offset=0', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            //console.log(info.count);
            //return info.count;
            res.json({"count" : info.count});
        }
        else if(error){
            return [];
        }
    });
}

module.exports = bringApi;