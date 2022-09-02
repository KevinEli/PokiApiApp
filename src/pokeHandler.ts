
import { Handler, Context, Callback } from 'aws-lambda';
import { PokeService } from './services/pokeService';


export const sync: Handler = async (event: any, context: Context, callback: Callback) => {
    let pokeService = new PokeService();
    let result = await pokeService.syncPokemon();

    const response = {
        statusCode: 200,
        body: result
    };

    return callback(null, response);
};

export const pokemon: Handler = (event: any, context: Context, callback: Callback) => {
    let pokeService = new PokeService();
    const response = {
        statusCode: 200,
        body: pokeService.getPokemon(event)
    };

    return callback(null, response);
};

export const pokemonByNameId: Handler = async (event: any, context: Context, callback: Callback) => {

    let pokeService = new PokeService();
    let body = await pokeService.getPokemonById(event.pathParameters.NameId);

    const response = {
        statusCode: 200,
        body
    };

    return callback(null, response);
};

export const pokemonType: Handler = (event: any, context: Context, callback: Callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'pokemonType, desde AWS utilizando serverless'
        }),
    };

    return callback(null, response);
};