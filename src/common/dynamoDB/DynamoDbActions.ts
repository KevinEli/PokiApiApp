import { DynamoDB } from 'aws-sdk';
import { Constants } from '../resources/constants'


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

    const rows = await documentClient.scan({
      TableName: Constants.TableName,
      AttributesToGet: ['Id'],
    }).promise();

    rows.Items?.forEach(async (element) => {
      await documentClient.delete({
        TableName: Constants.TableName,
        Key: element,
      }).promise();
    });

  },
  
  async get(Id: number, TableName: string) {
    const params = {
      TableName,
      Key: {
        Id,
      },
    };
    console.log(Id);
    console.log(TableName);
    const data = await documentClient.get(params).promise();
    /*const data = await documentClient.get(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      }
  }).promise();*/

    if (!data || !data.Item) {
      throw Error(`There was an error fetching the data for ID of ${Id} from ${TableName}`);
    }
    console.log(data);

    return data.Item;
  },

  async write(data: any, TableName: string) {
    if (!data.ID) {
      throw Error('no ID on the data');
    }

    const params = {
      TableName,
      Item: data,
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error(`There was an error inserting ID of ${data.Id} in table ${TableName}`);
    }

    return data;
  }


}

