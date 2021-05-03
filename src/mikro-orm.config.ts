import { __prod__ } from "./constants";
import { Post } from "./entities/post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';

export default {
  migrations: {
    path: path.join(__dirname,'./migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/, //allow ts or js files 
  },
  entities: [Post],
  dbName: "mini-reddit",
  type: "postgresql",
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];