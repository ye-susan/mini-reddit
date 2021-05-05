import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Mutation, Args, Arg, InputType, Field, Ctx, ObjectType, Query } from "type-graphql";
import argon2, { hash } from "argon2";

@InputType()
class UsernamePasswordInput{
  @Field()
  username: string
  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message:string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true }) 
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver() 
export class UserResolver {

  @Query(() => User, { nullable: true })
  async me (@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      return null; //not logged in
    }

    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }


  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be greater than length of 2."
          },
        ],
      }
    }

    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be at least 3 characters."
          },
        ],
      }
    }

    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, { username: options.username, password: hashedPassword })
    try { 
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === '23505' ) {
        return {
          errors :[
            {
              field: "username",
              message: "Username already exists."
            }
          ]
        }

      }
      console.log(`Message: ${err.message}`)
    }
    
    //store user id session - will set cookie on user and keep them logged in 
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {username: options.username});

    if (!user) {
      return {
        errors: [{
          field: "username",
          message: "That username doesn't exist."
        },
      ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if(!valid) {
      return {
        errors: [{
          field: "password",
          message: "Incorrect password."
        },
      ],
      };
    }
    
    req.session.userId = user.id;
    
    return { user };
  }

}