import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(microConfig); 
  await orm.getMigrator().up(); 

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false
    }),
    context: () => ({ em: orm.em }) 
    //We want to be able to query everything from our Resolvers and return the info to do that we need to access the orm obj in the resolvers

    //context: is a special obj that's accessible by all resolvers; can stick orm object in there - and with it, the em object 
    // it's a function that returns an obj for the context
    // context can have (req, res) also
  })

  apolloServer.applyMiddleware({ app }) //create graphql endpt on express for us
  
  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}

main().catch((err) => {
  console.log(err);
});