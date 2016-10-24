import Promise from 'bluebird';
import AWS from 'aws-sdk';
import loadConfig from '../config';

loadConfig();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const dynamo = new AWS.DynamoDB.DocumentClient();
const stage = 'stage';
const usersTable = `users-${stage}`;

// Users
export function createUser(user) {
  if (!user.createdAt) {
    user.createdAt = +new Date();
  }

  user.updatedAt = user.createdAt;

  return new Promise((resolve, reject) => {
    const params = {
      TableName: usersTable,
      Item: user
    };

    dynamo.put(params, (err) => {
      if (err) {
        // console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
        return reject(err);
      } else {
        // Note: ReturnValues for put is NONE by default
        // see http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_RequestSyntax
        return resolve();
      }
    });
  });
}

export function deleteUser(phoneNumber) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: usersTable,
      Key: { phoneNumber }
    };

    dynamo.delete(params, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

export function getUser(phoneNumber) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: usersTable,
      Key: { phoneNumber }
    };

    dynamo.get(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data.Item);
    });
  });
}

export function updateUser(phoneNumber, user) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: usersTable,
      Key: { phoneNumber },
      UpdateExpression: 'set givenName = :givenName, lastName = :lastName, email = :email, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':givenName': user.givenName,
        ':lastName': user.lastName,
        ':email': user.email,
        ':updatedAt': +new Date()
      },
      ReturnValues: 'UPDATED_NEW'
    };

    dynamo.update(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

export function getUsers() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: usersTable
    };

    dynamo.scan(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data.Items);
    });
  });
}
