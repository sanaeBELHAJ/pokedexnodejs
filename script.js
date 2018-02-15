const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports.callApi = async function(res){
    console.log("--Récupération des pokemons--");
    let pokemons = [];
    pokemons = await fetch("http://www.pokemontrash.com/pokedex/liste-pokemon.php")
                .then(res => res.text())
                .then(html => cheerio.load(html))
                .then($ => {
                    let i=0;
                    $("#pokedex-list table.pokedex:last-child tbody").each((key,value) => {
                        $(value).children("tr").each((index,element) =>{
                            let pokemon = $(element).children("td");

                            let id = $(element).children("td:first-child").text();
                            let name = pokemon.children("img").attr("alt");
                            let img = "http://www.pokemontrash.com/pokedex/"+pokemon.children("img").attr("src");
                            let type = pokemon.children("span.type1").text();
                            let type2 = (typeof(pokemon.children("span.type2").text()) != undefined) ? pokemon.children("span.type2").text() : "";
                            let niveau = 1;

                            pokemons.push({
                                id,
                                name,
                                img,
                                type,
                                type2,
                                niveau
                            });
                            i++;
                        });
                    });
                    console.log("Total de pokémons récupérés : "+i);
                    return pokemons;
                });
    return getEvols(pokemons);
}

async function getEvols(pokemons){
    console.log("--Récupération des évolutions--");
    const liste = [];
    let i=0;
    for(let item of pokemons){
        const evolutions = await fetch("http://www.pokemontrash.com/pokedex/"+item.id+"-"+item.nom+".html")              
                        .then(res => res.text())
                        .then(html => cheerio.load(html))
                        .then($ => {
                            let i=0;
                            const listEvol = [];
                            $("#Stages div").each((key,value) => {
                                let niveauEvolution = $(value).children("span.evolution-trigger").text();
                                let evolutionName = $(value).children("a").text();
                                const evolution = {
                                    niveauEvolution,
                                    evolutionName
                                };
                                listEvol.push(evolution);
                            });
                            return listEvol;
                        }); 
        const newPoke = {
            ...item,
            evolutions: evolutions    
        };
        liste.push(newPoke);
        if(i%50==0)
            console.log("Progression : "+i);
        i++;
    }
    console.log("Récupération terminée");
    return liste;
}

/*
    CODE D'APPEL API - (annulé car sature l'API)

    const fetch = require('node-fetch');

    function bringPkm(res){
        callApi('https://pokeapi.co/api/v2/pokemon/?limit=3&offset=0')
                .then(resultat => getInfos(resultat.results))
                .then(tabPokemeons => console.log(tabPokemeons))
    }

    async function getInfos(pokemons){
        const tab = []
        for(let item of pokemons){
            const resultat =  await callApi(item.url)
            let id = item.url.replace('https://pokeapi.co/api/v2/pokemon/', '');
            id = parseInt(item.id.replace('/',''));
            const newObj = {
            ...item,
            id: id,
            image :  resultat.sprites.front_default,
            }
            tab.push(newObj)    
        }
        return tab
    }

    module.exports = bringPkm;

    function callApi(url){
        return fetch(url)
                .then(data => {
                    const res = data.json();
                    return res;
                })
                .catch(err => ({error : err, msg: "c'est une erreur"}));
    }
*/