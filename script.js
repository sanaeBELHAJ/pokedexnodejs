const fetch = require("node-fetch");
const cheerio = require("cheerio");

async function bringPkm(res){
    let pokemons = [];
    pokemons = await fetch("http://www.pokemontrash.com/pokedex/liste-pokemon.php")
                .then(res => res.text())
                .then(html => cheerio.load(html))
                .then($ => {
                    let i=0;
                    $("#pokedex-list table.pokedex tbody").each((key,value) => {
                        $(value).children("tr").each((index,element) =>{
                            let pokemon = $(element).children("td");

                            let id = $(element).children("td:first-child").text();
                            let nom = pokemon.children("img").attr("alt");
                            let image = "http://www.pokemontrash.com/pokedex/"+pokemon.children("img").attr("src");
                            let type = pokemon.children("span.type1").text();
                            let type2 = (typeof(pokemon.children("span.type2").text()) != undefined) ? pokemon.children("span.type2").text() : "";
                
                            pokemons.push({
                                id,
                                nom,
                                image,
                                type,
                                type2
                            });
                            i++;
                        });
                    });
                    console.log("Total : "+i);
                    return pokemons;
                });
    console.log("--DONE: Récupération des pokemons--");
    return getEvols(pokemons);
}

async function getEvols(pokemons){
    const liste = [];
    let i=0;
    for(let item of pokemons){
        //const resultat = await fetch("http://www.pokemontrash.com/pokedex/1-Bulbizarre.html") 
        const resultat = await fetch("http://www.pokemontrash.com/pokedex/"+item.id+"-"+item.nom+".html")              
                        .then(res => res.text())
                        .then(html => cheerio.load(html))
                        .then($ => {
                            let i=0;
                            const listEvol = [];
                            $("#Stages div").each((key,value) => {
                                let restrictions = $(value).children("span.evolution-trigger").text();
                                let nom = $(value).children("a").text();
                                const evolution = {
                                    restrictions,
                                    nom
                                };
                                listEvol.push(evolution);
                            });
                            return listEvol;
                        }); 
        const newPoke = {
            ...item,
            resultat    
        };
        liste.push(newPoke);
        if(i%50==0)
            console.log("Progression : "+i);
        i++;
    }
    console.log("--DONE: Récupération des évolutions--");
    return liste;
}

module.exports = bringPkm;

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