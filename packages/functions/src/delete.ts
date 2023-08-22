import { Table } from "sst/node/table";
import handler from "@spark/core/handler";
import dynamoDb from "@spark/core/dynamodb";

export const main = handler(async (event) => {
  return await deleteNote(event);
});

export const deleteNote = async (event) => {
  const params = {
    TableName: Table.Notes.tableName,
    // 'Key' defines the partition key and sort key of the item to be removed
    Key: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
      noteId: event.pathParameters.id, // The id of the note from the path
    },
  };

  await dynamoDb.delete(params);

  return { status: true };
};
