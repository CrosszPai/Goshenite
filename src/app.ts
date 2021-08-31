import "reflect-metadata";
import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "fastify-autoload";
import { FastifyPluginAsync } from "fastify";
import { buildSchema } from "type-graphql";

import * as TypeORM from "typeorm";
import { Container } from "typeorm-typedi-extensions";

TypeORM.useContainer(Container);

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  let schema = await buildSchema({
    resolvers: [__dirname + "/**/*.resolver.{ts,js}"],
    container: Container,
  });
  const options = { ...opts, schema };

  await TypeORM.createConnection({
    name: "default",
    type: "postgres",
    url: "postgresql://postgres:1234@db:5432/goshenite",
    entities: [__dirname + "/**/*.schema.{ts,js}"],
    synchronize: true,
  });
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options,
  });
};

export default app;
export { app };