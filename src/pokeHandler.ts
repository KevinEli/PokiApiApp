
import { Handler, Context, Callback } from 'aws-lambda';
import { PokeService } from './services/pokeService';
import { Responses } from './common/responses/codeResponse'

export const sync: Handler = async (event: any, context: Context, callback: Callback) => {
    let pokeService = new PokeService();
    let result = await pokeService.syncPokemon();

    if ( !result ) {
        return Responses.BadRequest({ message: 'Failed to sync external data' });
    }

    return Responses.OK({ message: "Successfull Sync :)" });
};


export const pokemon: Handler = async (event: any, context: Context, callback: Callback) => {
    let pokeService = new PokeService();
    let result = await pokeService.getPokemons();
    
    if ( !result ) {
        return Responses.BadRequest({ message: 'No data to show' });
    }

    return Responses.OK({ result });
};

export const pokemonByNameId: Handler = async (event: any, context: Context, callback: Callback) => {

    let pokeService = new PokeService();
    let criterial = event.pathParameters.NameId;
    let result = await pokeService.getPokemonByNameorId(criterial);

    if ( !result ) {
        return Responses.BadRequest({ message: `No matching records were found with ${criterial}` });
    }

    return Responses.OK({ result });
};


export const pokemonType: Handler = async (event: any, context: Context, callback: Callback) => {
    
    let pokeService = new PokeService();
    let result = await pokeService.getPokemonType(event.pathParameters.Type);
    let errorMsg = pokeService.geterrorMessage();

    if ( errorMsg ) return Responses.NotFound({ message: errorMsg });
    
    if ( !result ) 
        return Responses.BadRequest({ message: `No dataType found were found with ${event.pathParameters.Type}` });

    return Responses.OK(result);
};