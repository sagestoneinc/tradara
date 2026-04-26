import { Client, Databases } from "node-appwrite";

export interface AppwriteClientConfig {
  endpoint: string;
  projectId: string;
  apiKey: string;
}

export function createAppwriteClient(config: AppwriteClientConfig): Client {
  return new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);
}

export function createDatabases(client: Client): Databases {
  return new Databases(client);
}
