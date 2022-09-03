import { DynamoDB } from 'aws-sdk';
import axios from 'axios';
import { DynamoDbActions } from '../common/dynamoDB/DynamoDbActions'
import { Constants } from '../common/resources/constants'

export class PokeService {

    async syncPokemon() {
        try {
            const res = await axios.get(Constants.ExternalUrl.GetPokemon).then(async response => {
                if (response.data) {
                    const pokemonModels: DynamoDB.DocumentClient.BatchWriteItemInput = {
                        RequestItems: {
                            PokemonLocal: response.data.results.map((el: any, index: number) => {
                                return {
                                    PutRequest: {
                                        Item: {
                                            Id: (index + 1).toString(),
                                            Name: el.name, Url: el.url
                                        }
                                    }
                                };
                            })
                        }
                    }

                    await DynamoDbActions.truncateTable();

                    await DynamoDbActions.bulkInsert(pokemonModels);

                    return JSON.stringify(pokemonModels);
                }

            }).catch(error => {
                throw new Error(`An Error Ocurred syncPokemon: ${error}`);
            });

            return res;

        } catch (error) {
            throw error;
        }
    }

    async getPokemons() {
        const getAllPokemon = await DynamoDbActions.getAllItems();
        return JSON.stringify({ getAllPokemon });
    }


    async getPokemonByNameorId(nameId: any) {
        const searchPokemon = await DynamoDbActions.getItemByNameorId(nameId);
        return searchPokemon;
    }


}