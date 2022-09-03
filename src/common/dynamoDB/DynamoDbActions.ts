import { DynamoDB } from 'aws-sdk';
import { Constants } from '../resources/constants'
import { FilterModel } from '../models/filterModel'

const documentClient = new DynamoDB.DocumentClient({ region: 'us-east-2' });

export const DynamoDbActions = {

  async bulkInsert(params: DynamoDB.DocumentClient.BatchWriteItemInput) {
    try {
      await documentClient.batchWrite(params).promise()
    } catch (error) {
      throw new Error(`Error Inserting Pokemon Data bulkInsert ${error}`);
    }
  },

  async truncateTable() {
    try {
      const rows = await documentClient.scan({ TableName: Constants.TableName, AttributesToGet: ['Id'] }).promise();

      rows.Items?.forEach(async (element) => {
        await documentClient.delete({ TableName: Constants.TableName, Key: element }).promise();
      });
    } catch (error) {
      throw new Error(`Error deleting Pokemon Data ${error}`);
    }

  },

  async getAllItems() {
    return await documentClient.scan({ TableName: Constants.TableName }).promise();
  },

  async getItemById(id: string) {
    return await documentClient.get({ TableName: Constants.TableName, Key: { Id: id } }).promise();
  },

  async getItemByFilter(key: FilterModel) {
    let params = {
      TableName: Constants.TableName,
      IndexName: key.indexName,
      KeyConditionExpression: '#keyname = :keyvalue',
      ExpressionAttributeNames: {
        '#keyname': key.name,
      },
      ExpressionAttributeValues: {
        ':keyvalue': key.value,
      },
    };
    return await documentClient.query(params).promise();
  },

  async getItemByNameorId(criterial: any) {
    try {

      if (!isNaN(criterial)) {
        return await this.getItemById(criterial)
      } else {
        const key: FilterModel = { name: 'Name', value: criterial.toString(), indexName :'Name_index' };
        return await this.getItemByFilter(key);
      }

    } catch (error) {
      throw new Error(`Error getting Pokemon Data ${error}`);
    }
  },

}

