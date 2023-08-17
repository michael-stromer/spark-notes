import { DynamoDBClient, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DeleteCommandInput, DynamoDBDocumentClient, GetCommand, GetCommandInput, PutCommand, PutCommandInput, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";


const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client, translateConfig);

export default {
  get: async (params: GetCommandInput) => await docClient.send(new GetCommand(params)),
  put: async (params: PutCommandInput) => await docClient.send(new PutCommand(params)),
  query: async (params: QueryCommandInput) => await docClient.send(new QueryCommand(params)),
  update: async (params: UpdateCommandInput) => await docClient.send(new UpdateCommand(params)),
  delete: async (params: DeleteCommandInput) => await docClient.send(new DeleteCommand(params)),
};