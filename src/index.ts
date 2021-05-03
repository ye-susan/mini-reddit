import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/post";
import microConfig from "./mikro-orm.config";

const main = async () => {

  const orm = await MikroORM.init(microConfig); 
  const post = orm.em.create(Post, {title: "My first post"}); //create new post
  await orm.em.persistAndFlush(post); //insert into DB
  await orm.em.nativeInsert(Post, {title: "My second post"})
}

main().catch((err) => {
  console.log(err);
});