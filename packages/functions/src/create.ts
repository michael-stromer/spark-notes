import { Table } from "sst/node/table";
import { v4 as uuidv4 } from 'uuid';
import handler from "@spark/core/handler";
import dynamoDb from "@spark/core/dynamodb";

export const main = handler(async (event: any) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: Table.Notes.tableName,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
      noteId: uuidv4(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});