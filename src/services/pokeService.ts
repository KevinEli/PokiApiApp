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
                                            name: el.name, url: el.url
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



    getPokemon(event: any): string {
        return JSON.stringify({
            message: 'getPokemon, desde AWS utilizando serverless v1'
        });
    }


    async getPokemonById(nameId: any) {
        const searchPokemon = await DynamoDbActions.get(nameId, "PokemonLocal")
            .then(data => data.Item)
            .catch(error => console.log(error));

        const result = JSON.stringify(searchPokemon);

        return JSON.stringify({
            message: `getPokemon, desde AWS utilizando serverless ${result}`
        });
    }


}