import { Api, AppSyncApi, StackContext, use } from "sst/constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }: StackContext) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [table],
        environment: {
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
      },
    },
    cors: {
      allowMethods: ["GET"],
    },
    routes: {
      "POST /notes": "packages/functions/src/create.main",
      "GET /notes/{id}": "packages/functions/src/get.main",
      "GET /notes": "packages/functions/src/list.main",
      "PUT /notes/{id}": "packages/functions/src/update.main",
      "DELETE /notes/{id}": "packages/functions/src/delete.main",
      "POST /billing": "packages/functions/src/billing.main",
    },
  });

  // Create the AppSync GraphQL API
  const appsyncApi = new AppSyncApi(stack, "AppSyncApi", {
    schema: "packages/functions/src/graphql/schema.graphql",
    cdk: {
      graphqlApi: {
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.IAM,
          },
        },
      },
    },
    defaults: {
      function: {
        // Bind the table name to the function
        bind: [table],
      },
    },
    dataSources: {
      notes: "packages/functions/src/main.handler",
    },
    resolvers: {
      "Query    listNotes": "notes",
      "Query    getNoteById": "notes",
      "Mutation createNote": "notes",
      "Mutation updateNote": "notes",
      "Mutation deleteNote": "notes",
    },
  });

  // Show the AppSync GraphQL API and Rest API endpoint in the output
  stack.addOutputs({
    AppsyncId: appsyncApi.apiId,
    AppsyncUrl: appsyncApi.url,
    AppsyncKey: appsyncApi.cdk.graphqlApi.apiKey || "",
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}
