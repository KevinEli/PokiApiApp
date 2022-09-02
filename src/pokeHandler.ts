
import { Handler, Context, Callback } from 'aws-lambda';
import { PokeService } from './services/pokeService';
import { Responses } from './common/responses/codeResponse'

export const sync: Handler = async (event: any, context: Context, callback: Callback) => {
    let pokeService = new PokeService();
    let result = await pokeService.syncPokemon();

    if ( !result ) {
        return Responses._400({ message: 'Failed to sync external data' });
    }

    return Responses._200({ message: "Successfull Sync :)" });
};


export const pokemon: Handler = async (event: any, context: Context, callback: Callback) => {
    let pokeService = new PokeService();
    let result = await pokeService.getPokemons();
    
    if ( !result ) {
        return Responses._400({ message: 'No data to show' });
    }

    return Responses._200({ result });
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