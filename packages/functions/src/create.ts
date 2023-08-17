import { Table } from "sst/node/table";
import crypto from "crypto";
import handler from "@spark/core/handler";
import dynamoDb from "@spark/core/dynamodb";

export const main = handler(async (event: any) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: Table.Notes.tableName,
    Item: {
      // The attributes of the item to be created
      userId: "123", // The id of the author
      noteId: crypto.randomUUID(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});